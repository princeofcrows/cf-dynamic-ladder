import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

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
    const solveRate = stats.totalAttempts > 0
      ? Math.round((stats.totalSolved / stats.totalAttempts) * 100)
      : 0

    const prompt = `You are an expert competitive programming coach. Analyze this Codeforces user and produce a detailed, personalized coaching report.

## Athlete Profile
- Handle: ${stats.handle}
- Rating: ${stats.rating} (${stats.rank || 'Unrated'}) | Max: ${stats.maxRating}
- Problems solved: ${stats.totalSolved} | Submissions: ${stats.totalAttempts} | Success rate: ${solveRate}%
- Hardest problem solved: rated ${stats.maxSolvedRating || 'unknown'}
- Contest momentum: ${stats.trajectory.momentum} — ${stats.trajectory.description}

## Topic Performance
${stats.categories
  .map((c: any) =>
    `- ${c.name}: ${c.solved} solved / ${c.failed} failed → ${Math.round(c.successRate * 100)}% success | avg difficulty ${c.avgRating || 'N/A'} | peak ${c.maxRating || 'N/A'}`
  )
  .join('\n')}

## Algorithm Identified Strengths
${stats.strengths.length > 0
  ? stats.strengths.map((s: any) => `- ${s.topic}: ${s.successRate}% success, ${s.solvedCount} solved`).join('\n')
  : '- Insufficient data'}

## Algorithm Identified Weaknesses  
${stats.weaknesses.length > 0
  ? stats.weaknesses.map((w: any) => `- ${w.topic}: ${w.struggleRate}% struggle rate, ${w.solvedCount} solved`).join('\n')
  : '- Insufficient data'}

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
    const cleaned = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim()
    let aiReport: any
    try {
      aiReport = JSON.parse(cleaned)
    } catch {
      return NextResponse.json(
        { error: 'Model returned malformed JSON. Please retry.', raw: cleaned },
        { status: 500 }
      )
    }

    // 5. Merge base profile + AI insights
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
      ai: aiReport,
    })
  } catch (error: any) {
    console.error('Coach AI error:', error)
    return NextResponse.json(
      { error: 'Failed to generate coaching report. Please try again.' },
      { status: 500 }
    )
  }
}
