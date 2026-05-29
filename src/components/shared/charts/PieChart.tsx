'use client'

import { useEffect, useState } from 'react'
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type DataType = {
  name: string
  value: number
}

type PieChartPropType = {
  data: DataType[]
  colors?: string[]
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#8dd1e1',
  '#a4de6c',
  '#d0ed57',
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-semibold text-gray-800">{payload[0].name}</p>
        <p className="text-sm font-medium text-blue-600">{`Count: ${payload[0].value}`}</p>
      </div>
    )
  }
  return null
}

export default function PieChart({ data, colors = COLORS }: PieChartPropType) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Tailwind "sm" breakpoint is 640px
    const mql = window.matchMedia('(max-width: 639px)')
    const onChange = () => setIsMobile(mql.matches)
    onChange()
    mql.addEventListener?.('change', onChange)
    return () => mql.removeEventListener?.('change', onChange)
  }, [])

  return (
    <div className="w-full h-[420px] sm:h-[400px]">
      <ResponsiveContainer width="99%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy={isMobile ? '42%' : '50%'}
            labelLine={false}
            outerRadius={isMobile ? 95 : 120}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={1500}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />

          {/* On mobile: legend below chart for readability */}
          <Legend
            layout={isMobile ? 'horizontal' : 'vertical'}
            verticalAlign={isMobile ? 'bottom' : 'middle'}
            align={isMobile ? 'center' : 'right'}
            iconType="circle"
            wrapperStyle={isMobile ? { paddingTop: '8px' } : { paddingLeft: '20px' }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}
