'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { getMonthlyRidesData } from '@/lib/mock-data';

export function RidesEvolutionChart() {
  const data = getMonthlyRidesData();

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Evolution des courses</h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="courses" name="Total" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="terminées" name="Terminées" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="annulées" name="Annulées" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
