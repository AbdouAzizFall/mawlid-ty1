'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

export default function DonutSplit({
  data,
  colors,
}: {
  data: { label: string; value: number }[]
  colors: string[]
}) {
  const filtered = data.filter((d) => d.value > 0)
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={filtered}
          dataKey="value"
          nameKey="label"
          innerRadius={50}
          outerRadius={75}
          paddingAngle={3}
        >
          {filtered.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E7E4DC', fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
