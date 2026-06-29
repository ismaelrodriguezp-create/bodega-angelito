import { TrendingUp, Users, Package, ShoppingCart } from "lucide-react";

export function KPICards() {
  const kpis = [
    {
      title: "Ingresos Totales",
      value: "S/ 12,450",
      change: "+15%",
      isPositive: true,
      icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
    },
    {
      title: "Pedidos Activos",
      value: "42",
      change: "+8%",
      isPositive: true,
      icon: <ShoppingCart className="w-5 h-5 text-blue-500" />,
    },
    {
      title: "Alertas de Stock",
      value: "5",
      change: "-2%",
      isPositive: false,
      icon: <Package className="w-5 h-5 text-amber-500" />,
    },
    {
      title: "Nuevos Clientes",
      value: "128",
      change: "+24%",
      isPositive: true,
      icon: <Users className="w-5 h-5 text-purple-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">{kpi.title}</h3>
            <div className="p-2 bg-slate-50 rounded-lg">{kpi.icon}</div>
          </div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-slate-800">{kpi.value}</div>
            <div
              className={`text-sm font-medium ${
                kpi.isPositive ? "text-emerald-500" : "text-amber-500"
              }`}
            >
              {kpi.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
