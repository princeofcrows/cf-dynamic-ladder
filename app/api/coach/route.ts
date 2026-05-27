import { NextRequest, NextResponse } from 'next/server'

function getCategory(tag: string): string {
  const tagLower = tag.toLowerCase()
  if (['dp', 'dynamic programming'].includes(tagLower)) return 'Dynamic Programming'
  if (['math', 'number theory', 'combinatorics', 'probabilities', 'games'].includes(tagLower)) return 'Math & Number Theory'
  if (['graphs', 'trees', 'dfs and similar', 'shortest paths', 'flows', 'trees'].includes(tagLower)) return 'Graphs & Trees'
  if (['data structures', 'dsu', 'strings', 'string suffix structures'].includes(tagLower)) return 'Data Structures'
  if (['greedy', 'constructive algorithms', 'sortings', 'two pointers'].includes(tagLower)) return 'Greedy & Constructive'
  if (['implementation', 'brute force'].includes(tagLower)) return 'Implementation'
  return 'Other'
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const handle = searchParams.get('handle')

  if (!handle) {
    return NextResponse.json({ error: 'Handle parameter is required' }, { status: 400 })
  }

  try {
    // 1. Fetch data from Codeforces API
    const [infoRes, statusRes, ratingRes] = await Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${handle}`),
      fetch(`https://codeforces.com/api/user.status?handle=${handle}`),
      fetch(`https://codeforces.com/api/user.rating?handle=${handle}`),
    ])

    const infoData = await infoRes.json()
    if (infoData.status !== 'OK' || !infoData.result || infoData.result.length === 0) {
      return NextResponse.json({ error: `User "${handle}" not found on Codeforces` }, { status: 404 })
    }

    const userInfo = infoData.result[0]
    const currentRating = userInfo.rating || 0

    const statusData = await statusRes.json()
    const ratingData = await ratingRes.json()

    const submissions = statusData.status === 'OK' ? statusData.result : []
    const ratingHistory = ratingData.status === 'OK' ? ratingData.result : []

    // 2. Parse and analyze submission data
    const solvedProblems = new Set<string>()
    const solvedByTag: Record<string, number> = {}
    const failedByTag: Record<string, number> = {}
    const ratingsByTag: Record<string, number[]> = {}
    let totalSolved = 0
    let maxSolvedRating = 0
    let totalAttempts = 0

    submissions.forEach((sub: any) => {
      totalAttempts++
      const problem = sub.problem
      const rating = problem.rating || 0
      const problemKey = `${problem.contestId}-${problem.index}`
      const isSolved = sub.verdict === 'OK'
      const tags = problem.tags || []

      if (isSolved) {
        if (!solvedProblems.has(problemKey)) {
          solvedProblems.add(problemKey)
          totalSolved++
          if (rating > maxSolvedRating) {
            maxSolvedRating = rating
          }

          tags.forEach((tag: string) => {
            solvedByTag[tag] = (solvedByTag[tag] || 0) + 1
            if (rating > 0) {
              if (!ratingsByTag[tag]) ratingsByTag[tag] = []
              ratingsByTag[tag].push(rating)
            }
          })
        }
      } else {
        if (!solvedProblems.has(problemKey)) {
          tags.forEach((tag: string) => {
            failedByTag[tag] = (failedByTag[tag] || 0) + 1
          })
        }
      }
    })

    // 3. Aggregate statistics by unified Categories
    const categoryStats: Record<string, { solved: number; failed: number; ratings: number[] }> = {
      'Dynamic Programming': { solved: 0, failed: 0, ratings: [] },
      'Math & Number Theory': { solved: 0, failed: 0, ratings: [] },
      'Graphs & Trees': { solved: 0, failed: 0, ratings: [] },
      'Data Structures': { solved: 0, failed: 0, ratings: [] },
      'Greedy & Constructive': { solved: 0, failed: 0, ratings: [] },
      'Implementation': { solved: 0, failed: 0, ratings: [] },
      'Other': { solved: 0, failed: 0, ratings: [] },
    }

    Object.entries(solvedByTag).forEach(([tag, count]) => {
      const cat = getCategory(tag)
      categoryStats[cat].solved += count
      if (ratingsByTag[tag]) {
        categoryStats[cat].ratings.push(...ratingsByTag[tag])
      }
    })

    Object.entries(failedByTag).forEach(([tag, count]) => {
      const cat = getCategory(tag)
      categoryStats[cat].failed += count
    })

    // Compute metrics per category
    const analyzedCategories = Object.entries(categoryStats).map(([name, stats]) => {
      const total = stats.solved + stats.failed
      const successRate = total > 0 ? stats.solved / total : 1
      const avgRating = stats.ratings.length > 0 
        ? Math.round(stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length) 
        : 0
      const maxRatingInCat = stats.ratings.length > 0 ? Math.max(...stats.ratings) : 0
      const struggleIndex = total > 0 ? stats.failed / (stats.solved + 1) : 0

      return {
        name,
        solved: stats.solved,
        failed: stats.failed,
        successRate,
        avgRating,
        maxRating: maxRatingInCat,
        struggleIndex,
      }
    })

    // 4. Sort and extract strengths and weaknesses
    // Strengths: high success rate and solved count
    const strengths = [...analyzedCategories]
      .filter(c => c.solved >= 3)
      .sort((a, b) => b.successRate - a.successRate || b.solved - a.solved)
      .slice(0, 2)
      .map(c => ({
        topic: c.name,
        successRate: Math.round(c.successRate * 100),
        solvedCount: c.solved,
        avgRating: c.avgRating,
      }))

    // Weaknesses: categories with high struggleIndex or low solved count in necessary categories
    const weaknesses = [...analyzedCategories]
      .sort((a, b) => b.struggleIndex - a.struggleIndex || a.successRate - b.successRate)
      .slice(0, 2)
      .map(c => ({
        topic: c.name,
        struggleRate: Math.round((1 - c.successRate) * 100),
        solvedCount: c.solved,
        avgRating: c.avgRating,
      }))

    // 5. Evaluate Trajectory
    let momentum = 'Stable'
    let trajectoryDescription = 'Rating is holding steady.'
    if (ratingHistory.length >= 3) {
      const len = ratingHistory.length
      const r1 = ratingHistory[len - 3].newRating
      const r2 = ratingHistory[len - 2].newRating
      const r3 = ratingHistory[len - 1].newRating

      if (r3 > r2 && r2 > r1) {
        momentum = 'Upward'
        trajectoryDescription = 'Strong upward momentum. Gaining rating points rapidly across recent contests.'
      } else if (r3 < r2 && r2 < r1) {
        momentum = 'Downward'
        trajectoryDescription = 'Experiencing a slump. Losing rating in recent contests; focus on practice to reset.'
      } else if (r3 > r1) {
        momentum = 'Improving'
        trajectoryDescription = 'General positive trend with minor fluctuations.'
      } else {
        momentum = 'Plateau'
        trajectoryDescription = 'Plateaued rating. Stuck at the current tier; needs targeted practice of higher-level problems.'
      }
    } else if (ratingHistory.length > 0) {
      momentum = 'New Competitor'
      trajectoryDescription = 'Fewer than 3 contests completed. Establishing baseline performance.'
    } else {
      momentum = 'Inactive'
      trajectoryDescription = 'No contest history. Register for the upcoming rounds to start your rating journey.'
    }

    // 6. Actionable Improvement Path
    const targetMin = currentRating > 0 ? Math.floor(currentRating / 100) * 100 : 800
    const targetMax = targetMin + 200

    const weakTopic1 = weaknesses[0]?.topic || 'Dynamic Programming'
    const weakTopic2 = weaknesses[1]?.topic || 'Graphs & Trees'

    let steps: string[] = []
    if (currentRating < 1200) {
      steps = [
        `Master basic constructive algorithms and brute force implementations in the 800-1000 range.`,
        `Practice solving at least 15 math or greedy problems rated 1000-1100 to gain core logical confidence.`,
        `Build speed: participate in Div. 3 virtual contests and focus on solving A and B problems in under 30 minutes.`,
      ]
    } else if (currentRating < 1600) {
      steps = [
        `Bridge the gap in ${weakTopic1}: solve 10-12 problems specifically in this area rated 1300-1500.`,
        `Improve speed on implementation and basic data structures (sets, maps, queues) to secure quick solves on A/B/C problems.`,
        `Initiate training in ${weakTopic2} in the 1400 range, studying standard templates and solution write-ups.`,
      ]
    } else if (currentRating < 1900) {
      steps = [
        `Targeted hard practice: solve ${weakTopic1} and ${weakTopic2} problems in the range ${targetMin + 100} - ${targetMax + 100}.`,
        `Focus on standard algorithms: DFS/BFS variations, Tree Traversals, and Dynamic Programming transitions.`,
        `Speed and Strategy: Participate in Codeforces Div. 2 rounds. Allocate no more than 15 mins on A/B, saving quality time for C/D.`,
      ]
    } else {
      steps = [
        `Push past boundaries: solve problems in your weak topics (${weakTopic1}, ${weakTopic2}) rated ${currentRating + 100} - ${currentRating + 300}.`,
        `Deconstruct Div. 1 problems: study editorials for elegant tree segment/interval structures or flow implementations.`,
        `Mental agility: do virtual rounds focusing solely on Div. 2 D/E and Div. 1 B/C problems to develop deep heuristic strategies.`,
      ]
    }

    // Return aggregated results
    return NextResponse.json({
      handle: userInfo.handle,
      rank: userInfo.rank,
      rating: currentRating,
      maxRating: userInfo.maxRating || 0,
      avatar: userInfo.titlePhoto || userInfo.avatar || 'https://userpic.codeforces.org/no-title.jpg',
      totalSolved,
      maxSolvedRating,
      totalAttempts,
      strengths,
      weaknesses,
      trajectory: {
        momentum,
        description: trajectoryDescription,
        lastContestRating: ratingHistory.length > 0 ? ratingHistory[ratingHistory.length - 1].newRating : currentRating,
      },
      improvementPath: {
        targetRange: `${targetMin} - ${targetMax}`,
        steps,
      },
      categories: analyzedCategories,
    })

  } catch (error: any) {
    console.error('Error compiling coach summary:', error)
    return NextResponse.json({ error: 'Failed to compile coach summary report. Please check API connectivity.' }, { status: 500 })
  }
}
