import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

// ─── Shared category type (used by both /follow and /coach responses) ──────────
export interface CategoryStat {
  name: string
  solved: number
  failed: number
  successRate: number
  avgRating: number
  maxRating: number
  struggleIndex: number
}

// ─── /api/follow — raw rule-based stats ────────────────────────────────────────
export interface FollowReportType {
  handle: string
  rank: string
  rating: number
  maxRating: number
  avatar: string
  totalSolved: number
  maxSolvedRating: number
  totalAttempts: number
  strengths: Array<{ topic: string; successRate: number; solvedCount: number; avgRating: number }>
  weaknesses: Array<{ topic: string; struggleRate: number; solvedCount: number; avgRating: number }>
  trajectory: { momentum: string; description: string; lastContestRating: number }
  improvementPath: { targetRange: string; steps: string[] }
  categories: CategoryStat[]
}

// ─── /api/coach — AI-enriched report ──────────────────────────────────────────
export interface AIReportType {
  summary: string
  strengths: Array<{ topic: string; insight: string }>
  weaknesses: Array<{ topic: string; insight: string; priority: 'High' | 'Medium' | 'Low' }>
  trajectoryAnalysis: string
  improvementPath: {
    targetRating: number
    estimatedContests: number
    phases: Array<{
      phase: string
      duration: string
      focus: string
      actions: string[]
    }>
  }
  practiceRecommendations: Array<{
    type: string
    description: string
    priority: 'High' | 'Medium' | 'Low'
  }>
  mindsetTip: string
}

export interface TraineeReportType {
  handle: string
  rank: string
  rating: number
  maxRating: number
  avatar: string
  totalSolved: number
  maxSolvedRating: number
  totalAttempts: number
  trajectory: { momentum: string; description: string; lastContestRating: number }
  categories: CategoryStat[]
  ai: AIReportType
}

// ─── Hook: AI Coach report ─────────────────────────────────────────────────────
export const useTraineeReport = (handle: string | null) =>
  useQuery<TraineeReportType>({
    queryKey: ['trainee-report', handle],
    async queryFn() {
      if (!handle) return null
      const { data } = await axios.get('/api/coach', { params: { handle } })
      return data
    },
    enabled: !!handle,
    staleTime: 5 * 60 * 1000, // cache for 5 mins — AI calls are expensive
  })

// ─── Hook: Raw follow/stats report ────────────────────────────────────────────
export const useFollowReport = (handle: string | null) =>
  useQuery<FollowReportType>({
    queryKey: ['follow-report', handle],
    async queryFn() {
      if (!handle) return null as any
      const { data } = await axios.get('/api/follow', { params: { handle } })
      return data
    },
    enabled: !!handle,
  })
