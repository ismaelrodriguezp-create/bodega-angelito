"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "Bebidas y Licores", value: 45 },
  { name: "Abarrotes", value: 30 },
  { name: "Lácteos y Fiambres", value: 15 },
  { name: "Limpieza", value: 10 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export function SalesByCategoryChart() {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-100 shadow-sm col-span-1">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Ventas por Categoría</h3>
        <p className="text-sm text-slate-500">Distribución de ingresos</p>
      </div>
      <div className="h-[260px] w-full flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value) => `${value}%`}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Label inside donut */}
        <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-3xl font-bold text-slate-800">100%</span>
          <span className="text-xs text-slate-500">Total</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center text-xs text-slate-600">
            <span
              className="w-3 h-3 rounded-full mr-1.5"
              style={{ backgroundColor: COLORS[index] }}
            />
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
