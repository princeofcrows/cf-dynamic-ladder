import React from 'react'
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TooltipProps } from 'recharts'

type DataType = {
  label: string
  value: number
}

type SingleBarChartPropType = {
  data: DataType[]
  xAxisLabel: string
  yAxisLabel: string
  barColor?: string
  activeColor?: string
}

const CustomTooltip = (
  props: TooltipProps<number, string> &
    Pick<SingleBarChartPropType, 'xAxisLabel'> &
    Pick<SingleBarChartPropType, 'yAxisLabel'>
) => {
  const { active, payload, label, xAxisLabel, yAxisLabel } = props

  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-gray-800">{`${xAxisLabel}: ${label}`}</p>
        <p className="text-sm font-medium text-blue-600">{`${yAxisLabel}: ${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}

export default function SingleBarChart(props: SingleBarChartPropType) {
  const { barColor = '#2563eb', activeColor = '#1d4ed8' } = props

  return (
    <div className="w-full h-[400px] mt-2">
      <ResponsiveContainer width="99%" height="100%">
        <BarChart
          width={500}
          height={400}
          data={props.data}
          margin={{
            top: 15,
            right: 20,
            left: 10,
            bottom: 15,
          }}
        >
          <defs>
            <linearGradient id="barColorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={barColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={barColor} stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            name={props.xAxisLabel}
            axisLine={false}
            tickLine={false}
            dataKey={'label'}
            tick={{ fill: '#64748b', fontSize: 10 }}
            dy={10}
          />
          <YAxis
            name={props.yAxisLabel}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11 }}
            dx={-5}
          />
          <Tooltip content={<CustomTooltip xAxisLabel={props.xAxisLabel} yAxisLabel={props.yAxisLabel} />} />
          <Legend
            layout="vertical"
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ top: -10, right: 10 }}
          />
          <Bar
            barSize={20}
            radius={[4, 4, 0, 0]}
            name={props.yAxisLabel}
            dataKey={'value'}
            fill="url(#barColorGradient)"
            stroke={barColor}
            strokeWidth={1.5}
            activeBar={<Rectangle fill={activeColor} />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
