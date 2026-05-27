import React from 'react'
import { useCodeforcesInfo } from '@/src/hooks/stores/useCodeforcesInfo'
import { useUserStatus } from '@/src/hooks/users/useUserStatus'
import PieChart from '@/src/components/shared/charts/PieChart'
import ContainerCard from '../shared/cards/ContainerCard'
import PageHeader from '../shared/titles/PageHeader'
import withStateIndicator from '@/src/components/shared/higher-order/withStateIndicator'

function ProblemTagsPieChart() {
  const { statusParams } = useCodeforcesInfo()
  const { data: userStatusInfo } = useUserStatus(statusParams)

  const mapTags = () => {
    if (userStatusInfo == null) return []

    const tagCounts: Record<string, number> = {}

    userStatusInfo.forEach(submission => {
      if (submission.verdict === 'OK') {
        submission.problem.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        })
      }
    })

    const data = Object.entries(tagCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10) // Show top 10 tags for better readability

    return data
  }

  return (
    <ContainerCard className="h-full mt-4 w-full flex-col">
      <PageHeader className="text-blue-900 mx-4 mb-2" title="Problem Tags Distribution" />
      <PieChart data={mapTags()} />
    </ContainerCard>
  )
}

export default withStateIndicator(ProblemTagsPieChart)
