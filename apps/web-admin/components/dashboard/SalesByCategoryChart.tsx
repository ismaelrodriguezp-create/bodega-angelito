"use client";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Bebidas y Licores", value: 45 },
  { name: "Abarrotes", value: 30 },
  { name: "Lácteos", value: 15 },
  { name: "Limpieza", value: 10 },
];

const COLORS = ["#4f46e5", "#0ea5e9", "#10b981", "#f43f5e"];

export function SalesByCategoryChart() {
  return (
    <div className="mt-4">
      <div className="h-[160px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 15px -3px rgba(15,23,42,0.08)",
                fontSize: 13,
                fontFamily: "Plus Jakarta Sans"
              }}
              formatter={(value) => [`${Number(value ?? 0)}%`, "Participación"]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[22px] font-extrabold text-[#0f172a] font-sans">100%</span>
          <span className="text-[11px] font-medium text-[#64748b] uppercase tracking-wider">Total</span>
        </div>
      </div>
      <div className="space-y-2.5 mt-4">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center justify-between text-[13px] font-medium">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
              <span className="text-[#475569]">{item.name}</span>
            </div>
            <span className="font-bold text-[#0f172a]">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
