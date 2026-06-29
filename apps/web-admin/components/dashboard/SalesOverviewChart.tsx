"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { day: "Lun", sales: 850 },
  { day: "Mar", sales: 940 },
  { day: "Mié", sales: 1100 },
  { day: "Jue", sales: 1050 },
  { day: "Vie", sales: 1350 },
  { day: "Sáb", sales: 1800 },
  { day: "Dom", sales: 1950 },
];

export function SalesOverviewChart() {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-100 shadow-sm col-span-1 lg:col-span-2">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Resumen de Ventas</h3>
        <p className="text-sm text-slate-500">Últimos 7 días</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickFormatter={(value) => `S/${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSales)"
              activeDot={{ r: 6, strokeWidth: 0, fill: "#3b82f6" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
