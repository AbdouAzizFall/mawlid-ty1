'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts'

export default function BarSplit({
  data,
  colors,
}: {
  data: { label: string; value: number }[]
  colors: string[]
}) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#666F80' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#666F80' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          cursor={{ fill: 'rgba(200,155,60,0.08)' }}
          contentStyle={{ borderRadius: 12, border: '1px solid #E7E4DC', fontSize: 12 }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
