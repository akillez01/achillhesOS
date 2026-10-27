"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { day: "D1", ideal: 40, real: 40 },
  { day: "D2", ideal: 35, real: 37 },
  { day: "D3", ideal: 30, real: 33 },
  { day: "D4", ideal: 25, real: 26 },
  { day: "D5", ideal: 20, real: 24 },
  { day: "D6", ideal: 15, real: 18 },
  { day: "D7", ideal: 10, real: 13 }
];

export function BurndownChart() {
  return (
    <div className="h-64 w-full rounded-xl border border-zinc-800 bg-zinc-950/50 p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="day" stroke="#a1a1aa" />
          <YAxis stroke="#a1a1aa" />
          <Tooltip />
          <Line type="monotone" dataKey="ideal" stroke="#4ADE80" strokeDasharray="5 5" dot={false} />
          <Line type="monotone" dataKey="real" stroke="#22C55E" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
