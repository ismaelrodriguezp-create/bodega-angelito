import type { ProductWithStock } from '@bodega-angelito/shared';
import { formatCurrency } from '@bodega-angelito/shared';

export function StatusBadge({ stock, minStock }: { stock: number; minStock: number }) {
  if (stock === 0)
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
        style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
        Agotado
      </span>
    );
  if (stock <= minStock)
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
        style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
        Crítico
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
      style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
      Óptimo
    </span>
  );
}

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  Bebidas:        { bg: 'rgba(6,182,212,0.12)',   color: '#22d3ee' },
  Lácteos:        { bg: 'rgba(139,92,246,0.12)',  color: '#a78bfa' },
  Abarrotes:      { bg: 'rgba(99,102,241,0.12)',  color: '#818cf8' },
  Limpieza:       { bg: 'rgba(16,185,129,0.12)',  color: '#34d399' },
  Panadería:      { bg: 'rgba(245,158,11,0.12)',  color: '#fbbf24' },
  Snacks:         { bg: 'rgba(236,72,153,0.12)',  color: '#f472b6' },
  'Higiene Personal': { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa' },
};

function CategoryChip({ name }: { name: string }) {
  const style = CATEGORY_COLORS[name] ?? { bg: 'rgba(100,116,139,0.12)', color: '#94a3b8' };
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold"
      style={{ background: style.bg, color: style.color }}>
      {name}
    </span>
  );
}

interface ProductCatalogProps {
  products: ProductWithStock[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  search: string;
  category: string;
  categoryOptions: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onAddClick: () => void;
}

export function ProductCatalog({
  products,
  isLoading,
  isError,
  error,
  search,
  category,
  categoryOptions,
  onSearchChange,
  onCategoryChange,
  onAddClick,
}: ProductCatalogProps) {
  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Todos' || p.category === category;
    return matchSearch && matchCat;
  });

  const activeCount = products.filter(p => p.stock > 0).length;
  const criticalCount = products.filter(p => p.stock > 0 && p.stock <= p.minStock).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] md:text-[30px] font-extrabold tracking-tight"
            style={{ color: '#0f172a' }}>
            Catálogo de Productos
          </h1>
          <p className="text-[14px] mt-1" style={{ color: '#64748b' }}>
            {isLoading ? 'Cargando inventario...' : `${products.length} productos registrados en tu tienda`}
          </p>
        </div>
        <button
          onClick={onAddClick}
          className="inline-flex items-center gap-2 text-white text-[14px] font-bold px-5 py-2.5 rounded-2xl shadow-lg transition-all"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 8px 25px -8px rgba(99,102,241,0.5)',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <line x1="12" y1="5" x2="12" y2="19" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          Nuevo Producto
        </button>
      </div>

      {/* Mini stats bar */}
      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Con Stock', value: activeCount, color: '#34d399', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
            { label: 'Stock Crítico', value: criticalCount, color: '#fbbf24', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
            { label: 'Agotados', value: outOfStockCount, color: '#f87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
          ].map(stat => (
            <div key={stat.label} className="rounded-2xl p-4 text-center"
              style={{ background: stat.bg, border: `1px solid ${stat.border}` }}>
              <div className="text-[22px] font-extrabold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[11px] font-semibold mt-0.5" style={{ color: stat.color, opacity: 0.75 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#f87171" strokeWidth="2" />
            <line x1="12" y1="8" x2="12" y2="12" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="text-[14px]" style={{ color: '#f87171' }}>
            {error instanceof Error ? error.message : 'Error al cargar productos'}
          </p>
        </div>
      )}

      {/* Main Table Card */}
      <div className="rounded-3xl overflow-hidden"
        style={{ background: 'white', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px -8px rgba(15,23,42,0.08)' }}>

        {/* Toolbar */}
        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          style={{ borderBottom: '1px solid #f1f5f9' }}>
          <p className="text-[13px] font-semibold" style={{ color: '#64748b' }}>
            {filtered.length} de {products.length} productos
          </p>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center rounded-xl px-3 h-9 gap-2 flex-1 sm:w-52"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="#94a3b8" strokeWidth="2" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-transparent text-[13px] outline-none w-full"
                style={{ color: '#0f172a' }}
                placeholder="Buscar producto..."
              />
            </div>
            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="h-9 px-3 rounded-xl text-[13px] font-medium outline-none appearance-none cursor-pointer"
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#475569',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                paddingRight: '30px',
              }}
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse"
              style={{ background: 'rgba(99,102,241,0.1)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                  stroke="#6366f1" strokeWidth="2" />
              </svg>
            </div>
            <p className="text-[14px] font-medium" style={{ color: '#94a3b8' }}>Cargando catálogo...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Producto</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Categoría</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-right" style={{ color: '#94a3b8' }}>Precio / Costo</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: '#94a3b8' }}>Stock</th>
                  <th className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: '#94a3b8' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    className="transition-all"
                    style={{
                      borderBottom: '1px solid #f8fafc',
                      background: i % 2 === 0 ? 'white' : '#fafbfc',
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLTableRowElement).style.background = '#f0f4ff')}
                    onMouseLeave={e => ((e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? 'white' : '#fafbfc')}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))' }}>
                          <span className="text-[13px] font-bold" style={{ color: '#6366f1' }}>
                            {p.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-[14px] font-semibold" style={{ color: '#0f172a' }}>{p.name}</div>
                          <div className="text-[11px] font-mono mt-0.5" style={{ color: '#94a3b8' }}>
                            {p.sku} {p.brand && `· ${p.brand}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <CategoryChip name={p.category} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="text-[14px] font-bold" style={{ color: '#0f172a' }}>
                        {formatCurrency(p.price)}
                      </div>
                      <div className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>
                        Costo: {formatCurrency(p.cost)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="text-[15px] font-bold" style={{ color: '#0f172a' }}>{p.stock}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>mín {p.minStock}</div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <StatusBadge stock={p.stock} minStock={p.minStock} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && !isError && (
              <div className="py-20 flex flex-col items-center gap-3">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="#cbd5e1" strokeWidth="2" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p className="text-[14px] font-medium" style={{ color: '#94a3b8' }}>
                  No se encontraron productos
                </p>
                <p className="text-[12px]" style={{ color: '#cbd5e1' }}>
                  Intenta ajustar los filtros de búsqueda
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
