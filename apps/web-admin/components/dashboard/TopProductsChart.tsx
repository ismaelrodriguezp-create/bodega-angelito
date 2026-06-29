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
            tick={{ fontSize: 12, fill: "#475569", fontFamily: "Plus Jakarta Sans", fontWeight: 500 }}
            width={110}
          />
          <Tooltip
            cursor={{ fill: "rgba(241,245,249,0.6)" }}
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 15px -3px rgba(15,23,42,0.08)",
              fontSize: 13,
              fontFamily: "Plus Jakarta Sans"
            }}
            formatter={(value) => [Number(value ?? 0), "Ventas"]}
          />
          <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 8, 8, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
