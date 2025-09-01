import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PayoutTrendChart({
  data,
}: {
  data: { date: string; payout: number; fees: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="payout"
          stroke="#4f46e5"
          fill="#818cf8"
          name="Payout"
        />
        <Area
          type="monotone"
          dataKey="fees"
          stroke="#dc2626"
          fill="#fca5a5"
          name="Fees"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
