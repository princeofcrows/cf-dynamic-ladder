import React from 'react'
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type DataType = {
  label: string
  value: number
}

type SingleBarChartPropType = {
  data: DataType[]
  xAxisLabel: string
  yAxisLabel: string
}

export default function SingleBarChart(props: SingleBarChartPropType) {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="99%" height="100%">
        <BarChart
          width={500}
          height={400}
          data={props.data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis name={props.xAxisLabel} axisLine={false} tickLine={false} dataKey={'label'} />
          <YAxis name={props.yAxisLabel} axisLine={false} tickLine={false} dataKey={'value'} />
          <Tooltip />
          <Legend layout="vertical" verticalAlign="top" iconType="square" wrapperStyle={{ top: -4, right: 0 }} />
          <Bar
            name={props.yAxisLabel}
            dataKey={'value'}
            fill="#8884d8"
            activeBar={<Rectangle fill="pink" stroke="blue" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
