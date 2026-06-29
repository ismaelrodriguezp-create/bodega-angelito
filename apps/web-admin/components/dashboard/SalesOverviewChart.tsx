"use client";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
    <div className="h-[220px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 15, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSalesLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b", fontFamily: "Plus Jakarta Sans" }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#64748b", fontFamily: "Plus Jakarta Sans" }}
            tickFormatter={(v) => `S/${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 15px -3px rgba(15,23,42,0.08)",
              fontSize: 13,
              fontFamily: "Plus Jakarta Sans"
            }}
            labelStyle={{ color: "#0f172a", fontWeight: 700 }}
            formatter={(value) => [`S/${Number(value ?? 0)}`, "Ventas"]}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#4f46e5"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorSalesLight)"
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0, fill: "#4f46e5" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
