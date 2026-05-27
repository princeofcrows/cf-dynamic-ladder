import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export interface TraineeReportType {
  handle: string
  rank: string
  rating: number
  maxRating: number
  avatar: string
  totalSolved: number
  maxSolvedRating: number
  totalAttempts: number
  strengths: Array<{
    topic: string
    successRate: number
    solvedCount: number
    avgRating: number
  }>
  weaknesses: Array<{
    topic: string
    struggleRate: number
    solvedCount: number
    avgRating: number
  }>
  trajectory: {
    momentum: string
    description: string
    lastContestRating: number
  }
  improvementPath: {
    targetRange: string
    steps: string[]
  }
  categories: Array<{
    name: string
    solved: number
    failed: number
    successRate: number
    avgRating: number
    maxRating: number
    struggleIndex: number
  }>
}

export const useTraineeReport = (handle: string | null) =>
  useQuery<TraineeReportType>({
    queryKey: ['trainee-report', handle],
    async queryFn() {
      if (!handle) return null
      const { data } = await axios.get(`/api/coach`, {
        params: { handle },
      })
      return data
    },
    enabled: !!handle,
  })
