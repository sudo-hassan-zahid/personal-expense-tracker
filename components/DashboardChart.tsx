"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export function DashboardChart({ data }: { data: { date: string; income: number; expense: number }[] }) {
  return (
    <div className="h-[300px] w-full bg-(--color-surface-card-dark) p-6 rounded-xl border border-(--color-hairline-on-dark)">
      <h2 className="text-title-md text-(--color-on-dark) mb-4">Income vs Expense</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-hairline-on-dark)" />
          <XAxis dataKey="date" stroke="var(--color-muted)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--color-muted)" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            cursor={{ fill: 'var(--color-surface-elevated-dark)' }}
            contentStyle={{ backgroundColor: 'var(--color-canvas-dark)', border: '1px solid var(--color-hairline-on-dark)', borderRadius: '8px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', bottom: 0 }} />
          <Bar dataKey="income" fill="var(--color-trading-up)" radius={[4, 4, 0, 0]} name="Income" />
          <Bar dataKey="expense" fill="var(--color-trading-down)" radius={[4, 4, 0, 0]} name="Expense" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
