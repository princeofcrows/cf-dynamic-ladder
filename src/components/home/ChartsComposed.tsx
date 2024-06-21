import { useCodeforcesInfo } from '@/src/hooks/stores/useCodeforcesInfo'
import withStateIndicator from '@/src/components/shared/higher-order/withStateIndicator'
import { useUserStatus } from '@/src/hooks/users/useUserStatus'
import SingleBarChart from '@/src/components/shared/charts/SingleBarChart'
import ContainerCard from '../shared/cards/ContainerCard'

function ChartsComposed() {
  const { statusParams } = useCodeforcesInfo()
  const { data: userStatusInfo } = useUserStatus(statusParams)

  return (
    <ContainerCard className="h-full mt-4 w-full">
      <SingleBarChart />
    </ContainerCard>
  )
}

export default withStateIndicator(ChartsComposed)
