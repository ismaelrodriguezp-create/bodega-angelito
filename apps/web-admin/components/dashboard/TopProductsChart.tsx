"use client";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "Cerveza Pilsen", sales: 450 },
  { name: "Arroz Costeño", sales: 380 },
  { name: "Inka Cola 3L", sales: 310 },
  { name: "Leche Gloria", sales: 290 },
  { name: "Panetón D'On.", sales: 250 },
];

export function TopProductsChart() {
  return (
    <div className="h-[220px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 15, left: 10, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#5f6368" }}
            width={110}
          />
          <Tooltip
            cursor={{ fill: "rgba(241,243,244,0.8)" }}
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "1px solid #dadce0",
              boxShadow: "0 2px 8px rgba(60,64,67,.2)",
              fontSize: 13,
            }}
            formatter={(v: number) => [v, "Ventas"]}
          />
          <Bar dataKey="sales" fill="#8430ce" radius={[0, 6, 6, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
