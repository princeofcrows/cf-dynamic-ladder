import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { useCodeforcesInfo } from '@/src/hooks/stores/useCodeforcesInfo'
import { useUserRating } from '@/src/hooks/users/useUserRating'
import ContainerCard from '../shared/cards/ContainerCard'
import PageHeader from '../shared/titles/PageHeader'
import withStateIndicator from '@/src/components/shared/higher-order/withStateIndicator'

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const diff = data.newRating - data.oldRating
    const diffText = diff >= 0 ? `+${diff}` : `${diff}`
    const diffColor = diff >= 0 ? 'text-green-600' : 'text-red-600'
    const date = new Date(data.ratingUpdateTimeSeconds * 1000).toLocaleDateString()

    return (
      <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-xl max-w-sm">
        <p className="text-xs font-semibold text-gray-500 mb-1">{date}</p>
        <p className="text-sm font-bold text-gray-800 leading-snug mb-2">{data.contestName}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <span className="text-gray-500">Rank:</span>
          <span className="font-semibold text-gray-900 text-right">{data.rank}</span>
          <span className="text-gray-500">Rating:</span>
          <span className="font-bold text-gray-900 text-right">{data.newRating}</span>
          <span className="text-gray-500">Change:</span>
          <span className={`font-bold ${diffColor} text-right`}>{diffText}</span>
        </div>
      </div>
    )
  }
  return null
}

function ContestHistoryChart() {
  const { statusParams } = useCodeforcesInfo()
  const { data: ratingHistory } = useUserRating(statusParams)

  if (!ratingHistory || ratingHistory.length === 0) {
    return (
      <ContainerCard className="h-full mt-4 w-full flex-col items-center justify-center p-8">
        <PageHeader className="text-blue-900 mb-2 text-center" title="Contest History" />
        <p className="text-gray-500 text-sm">No contest history found for this user.</p>
      </ContainerCard>
    )
  }

  // Format data for Recharts
  const data = ratingHistory.map((change) => ({
    ...change,
    date: new Date(change.ratingUpdateTimeSeconds * 1000).toLocaleDateString(),
  }))

  // Find min and max ratings to adjust Y-axis scale
  const ratings = ratingHistory.map((r) => r.newRating)
  const minRating = Math.min(...ratings)
  const maxRating = Math.max(...ratings)
  const yDomain = [Math.max(0, minRating - 100), maxRating + 100]

  return (
    <ContainerCard className="h-full mt-4 w-full flex-col">
      <PageHeader className="text-blue-900 mx-4 mb-2" title="Contest Rating History" />
      <div className="w-full h-[400px] mt-2">
        <ResponsiveContainer width="99%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 15,
              right: 20,
              left: 10,
              bottom: 15,
            }}
          >
            <defs>
              <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 10 }}
              dy={10}
              // Show fewer ticks for readability
              interval={Math.ceil(data.length / 10)}
            />
            <YAxis
              domain={yDomain}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              dx={-5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="newRating"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 2, stroke: '#2563eb', strokeWidth: 1, fill: '#fff' }}
              activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2, fill: '#fff' }}
              name="Rating"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ContainerCard>
  )
}

export default withStateIndicator(ContestHistoryChart)
