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

  if (active && !!payload) {
    return (
      <div className="bg-gray-100 bg-opacity-80 rounded-md p-4">
        <p className="m-2 text-sm font-medium">{`${xAxisLabel}- ${label}`}</p>
        <p className="m-2 text-sm font-medium">{`${yAxisLabel} - ${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}

export default function SingleBarChart(props: SingleBarChartPropType) {
  const { barColor = '#8884d8', activeColor = '#075985' } = props

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="99%" height="100%">
        <BarChart
          width={500}
          height={400}
          data={props.data}
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis name={props.xAxisLabel} axisLine={false} tickLine={false} dataKey={'label'} />
          <YAxis name={props.yAxisLabel} axisLine={false} tickLine={false} dataKey={'value'} />
          <Tooltip content={<CustomTooltip xAxisLabel={props.xAxisLabel} yAxisLabel={props.yAxisLabel} />} />
          <Legend layout="vertical" verticalAlign="top" iconType="square" wrapperStyle={{ top: -4, right: 0 }} />
          <Bar
            barSize={24}
            radius={4}
            name={props.yAxisLabel}
            dataKey={'value'}
            fill={barColor}
            activeBar={<Rectangle fill={activeColor} />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
