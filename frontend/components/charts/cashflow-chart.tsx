"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export function CashflowChart({ data }: { data: Array<{ date: string; income: number; expense: number }> }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <Tooltip />
          <Area type="monotone" dataKey="income" stroke="#22c55e" fill="#86efac" />
          <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="#fca5a5" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
