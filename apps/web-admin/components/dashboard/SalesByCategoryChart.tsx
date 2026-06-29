"use client";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Bebidas y Licores", value: 45 },
  { name: "Abarrotes", value: 30 },
  { name: "Lácteos", value: 15 },
  { name: "Limpieza", value: 10 },
];

const COLORS = ["#1a73e8", "#1e8e3e", "#f9ab00", "#d93025"];

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
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "1px solid #dadce0",
                boxShadow: "0 2px 8px rgba(60,64,67,.2)",
                fontSize: 13,
              }}
              formatter={(v: number) => [`${v}%`, "Participación"]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[22px] font-bold text-[#1f1f1f]">100%</span>
          <span className="text-[11px] text-[#5f6368]">Total</span>
        </div>
      </div>
      <div className="space-y-2 mt-3">
        {data.map((item, i) => (
          <div key={item.name} className="flex items-center justify-between text-[12px]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i] }} />
              <span className="text-[#5f6368]">{item.name}</span>
            </div>
            <span className="font-semibold text-[#1f1f1f]">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
