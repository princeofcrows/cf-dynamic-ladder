import { useCodeforcesInfo } from '@/src/hooks/stores/useCodeforcesInfo'
import withStateIndicator from '@/src/components/shared/higher-order/withStateIndicator'
import { useUserStatus } from '@/src/hooks/users/useUserStatus'
import SingleBarChart from '@/src/components/shared/charts/SingleBarChart'
import ContainerCard from '../shared/cards/ContainerCard'
import PageHeader from '../shared/titles/PageHeader'

function ChartsComposed() {
  const { statusParams } = useCodeforcesInfo()
  const { data: userStatusInfo } = useUserStatus(statusParams)

  const mapProblems = () => {
    if (userStatusInfo == null) return []
    let solvedCountDifficultyWise = []

    for (let i = 800; i <= 3500; i += 100) {
      solvedCountDifficultyWise.push({ value: 0, label: i })
    }

    userStatusInfo.forEach(u => {
      const index = solvedCountDifficultyWise.findIndex(s => s.label === u.problem.rating)

      if (index !== -1) {
        solvedCountDifficultyWise[index].value++
      }
    })

    return solvedCountDifficultyWise.map(({ value, label }) => ({ value, label: `${label}` }))
  }

  return (
    <ContainerCard className="h-full mt-4 w-full flex-col">
      <PageHeader className="text-blue-900 mx-4 mb-2" title="Difficulty wise solved problems" />
      <SingleBarChart
        xAxisLabel={'Difficulty rating'}
        yAxisLabel={'Solved count'}
        data={mapProblems()}
        barColor={'#0f766e'}
      />
    </ContainerCard>
  )
}

export default withStateIndicator(ChartsComposed)
