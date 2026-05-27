import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

type CFProblem = {
  contestId?: number
  problemsetName?: string
  index: string
  name: string
  type?: string
  points?: number
  rating?: number
  tags: string[]
}

type PracticeProblem = {
  name: string
  contestId: number
  index: string
  rating: number | null
  tags: string[]
  url: string
  reason: string
}

const CF_TAG_SYNONYMS: Array<{ match: RegExp; tags: string[] }> = [
  { match: /dp|dynamic programming/i, tags: ['dp'] },
  { match: /graph|graphs|tree|trees/i, tags: ['graphs', 'trees'] },
  { match: /shortest path|dijkstra|bellman/i, tags: ['shortest paths', 'graphs'] },
  { match: /dfs|bfs/i, tags: ['dfs and similar', 'graphs'] },
  { match: /two pointers|two-pointers/i, tags: ['two pointers'] },
  { match: /binary search/i, tags: ['binary search'] },
  { match: /greedy/i, tags: ['greedy'] },
  { match: /math|number theory|nt/i, tags: ['math', 'number theory'] },
  { match: /combinatorics/i, tags: ['combinatorics', 'math'] },
  { match: /strings?/i, tags: ['strings'] },
  { match: /data structures?|ds/i, tags: ['data structures'] },
  { match: /segment tree|fenwick|bit/i, tags: ['data structures'] },
  { match: /bitmask|bitmasks|bitset/i, tags: ['bitmasks'] },
  { match: /constructive/i, tags: ['constructive algorithms'] },
]

let problemsetCache: { fetchedAt: number; problems: CFProblem[] } | null = null

async function getProblemset(): Promise<CFProblem[]> {
  const now = Date.now()
  // Cache for 6 hours (CF problemset is large; avoid fetching repeatedly)
  if (problemsetCache && now - problemsetCache.fetchedAt < 6 * 60 * 60 * 1000) {
    return problemsetCache.problems
  }

  const res = await fetch('https://codeforces.com/api/problemset.problems', {
    // In Next.js route handlers this should be fine; we also do our own caching above
    cache: 'no-store',
  })
  const json = await res.json()
  if (!res.ok || json.status !== 'OK' || !Array.isArray(json.result?.problems)) {
    throw new Error('Failed to fetch Codeforces problemset')
  }

  const problems: CFProblem[] = json.result.problems
  problemsetCache = { fetchedAt: now, problems }
  return problems
}

function inferTagsFromWeaknesses(weaknesses: Array<{ topic: string }>): string[] {
  const out: string[] = []
  for (const w of weaknesses) {
    for (const rule of CF_TAG_SYNONYMS) {
      if (rule.match.test(w.topic)) {
        out.push(...rule.tags)
      }
    }
  }
  // De-dupe while preserving order (avoid Set iteration to keep TS configs happy)
  const seen: Record<string, true> = {}
  const uniq: string[] = []
  for (const t of out) {
    if (!seen[t]) {
      seen[t] = true
      uniq.push(t)
    }
  }
  return uniq
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n))
}

function roundToNearest(n: number, step: number) {
  return Math.round(n / step) * step
}

function buildProblemUrl(contestId: number, index: string) {
  return `https://codeforces.com/problemset/problem/${contestId}/${index}`
}

function pickPracticeProblems({
  problems,
  weaknesses,
  targetRating,
}: {
  problems: CFProblem[]
  weaknesses: Array<{ topic: string; priority?: string }>
  targetRating: number
}): PracticeProblem[] {
  const weaknessTopics = weaknesses
    .slice()
    .sort((a, b) => {
      const p = (x?: string) => (x === 'High' ? 0 : x === 'Medium' ? 1 : 2)
      return p(a.priority) - p(b.priority)
    })
    .map(w => w.topic)

  const desiredTags = inferTagsFromWeaknesses(weaknesses)

  // Prefer tagged problems in a tight band; then broaden band; then accept any tags.
  const bands = [200, 350, 500]

  const seen = new Set<string>()
  const picked: PracticeProblem[] = []

  const tryPick = (band: number, requireTagMatch: boolean) => {
    // Filter candidates
    const candidates = problems.filter(p => {
      if (!p.contestId || !p.index || !p.name) return false
      const rating = p.rating
      if (typeof rating !== 'number') return false
      if (Math.abs(rating - targetRating) > band) return false
      if (requireTagMatch && desiredTags.length > 0) {
        return p.tags?.some(t => desiredTags.includes(t))
      }
      return true
    })

    // Sort by closeness to target, then by rating
    candidates.sort((a, b) => {
      const ra = a.rating ?? 0
      const rb = b.rating ?? 0
      const da = Math.abs(ra - targetRating)
      const db = Math.abs(rb - targetRating)
      return da - db || ra - rb
    })

    for (const p of candidates) {
      if (picked.length >= 10) return
      const key = `${p.contestId}-${p.index}`
      if (seen.has(key)) continue
      seen.add(key)

      const matched = desiredTags.length ? (p.tags ?? []).filter(t => desiredTags.includes(t)) : []

      const topicHint = weaknessTopics.find(t => {
        const tags = inferTagsFromWeaknesses([{ topic: t }])
        return tags.length > 0 && (p.tags ?? []).some(pt => tags.includes(pt))
      })

      picked.push({
        name: p.name,
        contestId: p.contestId!,
        index: p.index,
        rating: p.rating ?? null,
        tags: p.tags ?? [],
        url: buildProblemUrl(p.contestId!, p.index),
        reason: topicHint
          ? `Targets weakness: ${topicHint}. Difficulty ~${p.rating} (near your practice target ${targetRating}).`
          : `Difficulty ~${p.rating} (near your practice target ${targetRating}).`,
      })
    }
  }

  for (const band of bands) {
    if (picked.length >= 10) break
    tryPick(band, true)
  }

  for (const band of bands) {
    if (picked.length >= 10) break
    tryPick(band, false)
  }

  return picked.slice(0, 10)
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const handle = searchParams.get('handle')

  if (!handle) {
    return NextResponse.json({ error: 'Handle parameter is required' }, { status: 400 })
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: 'AI coaching is not configured. Add GROQ_API_KEY to .env.local — get a free key at console.groq.com' },
      { status: 503 }
    )
  }

  try {
    // 1. Fetch raw stats from /api/follow
    const followUrl = new URL('/api/follow', request.url)
    followUrl.searchParams.set('handle', handle)
    const followRes = await fetch(followUrl.toString())

    if (!followRes.ok) {
      const err = await followRes.json()
      return NextResponse.json({ error: err.error || 'Failed to fetch user data' }, { status: followRes.status })
    }

    const stats = await followRes.json()

    // 2. Compose prompt
    const solveRate = stats.totalAttempts > 0 ? Math.round((stats.totalSolved / stats.totalAttempts) * 100) : 0

    const prompt = `You are an expert competitive programming coach. Analyze this Codeforces user and produce a detailed, personalized coaching report.

## Athlete Profile
- Handle: ${stats.handle}
- Rating: ${stats.rating} (${stats.rank || 'Unrated'}) | Max: ${stats.maxRating}
- Problems solved: ${stats.totalSolved} | Submissions: ${stats.totalAttempts} | Success rate: ${solveRate}%
- Hardest problem solved: rated ${stats.maxSolvedRating || 'unknown'}
- Contest momentum: ${stats.trajectory.momentum} — ${stats.trajectory.description}

## Topic Performance
${stats.categories
  .map(
    (c: any) =>
      `- ${c.name}: ${c.solved} solved / ${c.failed} failed → ${Math.round(c.successRate * 100)}% success | avg difficulty ${c.avgRating || 'N/A'} | peak ${c.maxRating || 'N/A'}`
  )
  .join('\n')}

## Algorithm Identified Strengths
${
  stats.strengths.length > 0
    ? stats.strengths.map((s: any) => `- ${s.topic}: ${s.successRate}% success, ${s.solvedCount} solved`).join('\n')
    : '- Insufficient data'
}

## Algorithm Identified Weaknesses
${
  stats.weaknesses.length > 0
    ? stats.weaknesses
        .map((w: any) => `- ${w.topic}: ${w.struggleRate}% struggle rate, ${w.solvedCount} solved`)
        .join('\n')
    : '- Insufficient data'
}

---

Respond with ONLY a JSON object (no markdown, no code fences) exactly matching this shape:
{
  "summary": "2-3 sentence overall assessment referencing their exact rating and stats",
  "strengths": [
    { "topic": "string", "insight": "2-3 sentence insight on why this is a strength and how to build on it" },
    { "topic": "string", "insight": "..." }
  ],
  "weaknesses": [
    { "topic": "string", "insight": "2-3 sentence diagnosis of the gap and root cause", "priority": "High" },
    { "topic": "string", "insight": "...", "priority": "Medium" },
    { "topic": "string", "insight": "...", "priority": "Low" }
  ],
  "trajectoryAnalysis": "2-3 sentences on rating momentum, what it means for this athlete",
  "improvementPath": {
    "targetRating": <next milestone as integer>,
    "estimatedContests": <integer>,
    "phases": [
      { "phase": "Phase name", "duration": "e.g. 2-3 weeks", "focus": "primary topic", "actions": ["action 1", "action 2", "action 3"] },
      { "phase": "...", "duration": "...", "focus": "...", "actions": ["...", "...", "..."] },
      { "phase": "...", "duration": "...", "focus": "...", "actions": ["...", "...", "..."] }
    ]
  },
  "practiceRecommendations": [
    { "type": "Problem Set", "description": "specific recommendation with counts or links", "priority": "High" },
    { "type": "Virtual Contest", "description": "...", "priority": "Medium" },
    { "type": "Upsolving", "description": "...", "priority": "High" }
  ],
  "mindsetTip": "One punchy, coach-voice motivational sentence personalized to their handle and situation"
}`

    // 3. Call Groq with LLaMA 3.3 70B (free, open-source)
    const chat = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2048,
    })

    const raw = chat.choices[0]?.message?.content?.trim() ?? ''

    // 4. Strip any accidental markdown fences and parse
    const cleaned = raw
      .replace(/^```(?:json)?\n?/i, '')
      .replace(/\n?```$/i, '')
      .trim()
    let aiReport: any
    try {
      aiReport = JSON.parse(cleaned)
    } catch {
      return NextResponse.json({ error: 'Model returned malformed JSON. Please retry.', raw: cleaned }, { status: 500 })
    }

    // 5. Build a 10-problem practice pack from Codeforces based on weaknesses + target difficulty
    let practiceProblems: PracticeProblem[] = []
    try {
      const problems = await getProblemset()
      const aiTarget = Number(aiReport?.improvementPath?.targetRating)
      const base = typeof stats.rating === 'number' ? stats.rating : 1200
      const target = Number.isFinite(aiTarget) ? aiTarget : base + 200
      const practiceTarget = clamp(roundToNearest(Math.round((base + target) / 2), 50), 800, 3500)

      practiceProblems = pickPracticeProblems({
        problems,
        weaknesses: Array.isArray(aiReport?.weaknesses) ? aiReport.weaknesses : [],
        targetRating: practiceTarget,
      })
    } catch (e) {
      // Non-fatal: AI report still works even if CF problemset fetch fails.
      practiceProblems = []
    }

    // 6. Merge base profile + AI insights + practice pack
    return NextResponse.json({
      handle: stats.handle,
      rank: stats.rank,
      rating: stats.rating,
      maxRating: stats.maxRating,
      avatar: stats.avatar,
      totalSolved: stats.totalSolved,
      maxSolvedRating: stats.maxSolvedRating,
      totalAttempts: stats.totalAttempts,
      trajectory: stats.trajectory,
      categories: stats.categories,
      ai: {
        ...aiReport,
        practiceProblems,
      },
    })
  } catch (error: any) {
    console.error('Coach AI error:', error)
    return NextResponse.json({ error: 'Failed to generate coaching report. Please try again.' }, { status: 500 })
  }
}
