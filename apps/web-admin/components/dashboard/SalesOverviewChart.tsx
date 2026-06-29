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
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSalesLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1a73e8" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#1a73e8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#80868b" }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#80868b" }}
            tickFormatter={(v) => `S/${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "1px solid #dadce0",
              boxShadow: "0 2px 8px rgba(60,64,67,.2)",
              fontSize: 13,
            }}
            labelStyle={{ color: "#1f1f1f", fontWeight: 600 }}
            formatter={(v: number) => [`S/${v}`, "Ventas"]}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#1a73e8"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorSalesLight)"
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0, fill: "#1a73e8" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
