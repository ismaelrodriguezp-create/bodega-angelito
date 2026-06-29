"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Cerveza Pilsen 620ml", sales: 450 },
  { name: "Arroz Costeño 1kg", sales: 380 },
  { name: "Gaseosa Inka Cola 3L", sales: 310 },
  { name: "Leche Gloria Evaporada", sales: 290 },
  { name: "Panetón D'Onofrio", sales: 250 },
];

export function TopProductsChart() {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-100 shadow-sm col-span-1">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Top 5 Productos</h3>
        <p className="text-sm text-slate-500">Más vendidos este mes</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#475569" }}
              width={120}
            />
            <Tooltip
              cursor={{ fill: "rgba(241, 245, 249, 0.5)" }}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 6, 6, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
