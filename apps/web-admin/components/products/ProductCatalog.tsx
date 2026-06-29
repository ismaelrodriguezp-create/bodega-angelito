import type { ProductWithStock } from '@bodega-angelito/shared';
import { formatCurrency } from '@bodega-angelito/shared';

export function StatusBadge({ stock, minStock }: { stock: number; minStock: number }) {
  if (stock === 0)
    return <span className="px-2.5 py-1 bg-[#fce8e6] text-[#d93025] text-[11px] font-semibold rounded-full">Agotado</span>;
  if (stock <= minStock)
    return <span className="px-2.5 py-1 bg-[#fef7e0] text-[#b06000] text-[11px] font-semibold rounded-full">Crítico</span>;
  return <span className="px-2.5 py-1 bg-[#e6f4ea] text-[#1e8e3e] text-[11px] font-semibold rounded-full">Óptimo</span>;
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#1f1f1f]">Catálogo de Productos</h1>
          <p className="text-[14px] text-[#5f6368] mt-1">
            {isLoading ? 'Cargando...' : `${products.length} productos registrados`}
          </p>
        </div>
        <button
          onClick={onAddClick}
          className="inline-flex items-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[14px] font-medium px-5 py-2.5 rounded-full shadow-sm transition-all"
        >
          Nuevo Producto
        </button>
      </div>

      {isError && (
        <div className="bg-[#fce8e6] border border-[#f5c6c2] text-[#c5221f] text-[14px] px-5 py-4 rounded-2xl">
          {error instanceof Error ? error.message : 'Error al cargar productos'}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#dadce0] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#f1f3f4] flex flex-col sm:flex-row sm:items-center justify-end gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center bg-[#f1f3f4] rounded-full px-3 h-9 gap-2 flex-1 sm:w-56">
              <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-transparent text-[13px] text-[#1f1f1f] placeholder-[#5f6368] outline-none w-full"
                placeholder="Buscar..."
              />
            </div>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="bg-[#f1f3f4] text-[13px] text-[#3c4043] rounded-full h-9 px-3 outline-none border-none cursor-pointer"
            >
              {categoryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-[#5f6368]">Cargando catálogo...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f8f9fa] border-b border-[#f1f3f4]">
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#80868b] uppercase">Producto</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#80868b] uppercase">Categoría</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#80868b] uppercase text-right">Precio</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#80868b] uppercase text-center">Stock</th>
                  <th className="px-5 py-3 text-[11px] font-semibold text-[#80868b] uppercase text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-[#f1f3f4] hover:bg-[#f8f9fa]">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-[14px]">{p.name}</div>
                      <div className="text-[12px] text-[#5f6368] font-mono">{p.sku} · {p.brand}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="bg-[#f1f3f4] text-[12px] font-medium px-2.5 py-1 rounded-full">{p.category}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="text-[14px] font-semibold">{formatCurrency(p.price)}</div>
                      <div className="text-[11px] text-[#5f6368]">Costo: {formatCurrency(p.cost)}</div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="text-[14px] font-semibold">{p.stock} un.</div>
                      <div className="text-[11px] text-[#80868b]">Mín: {p.minStock}</div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <StatusBadge stock={p.stock} minStock={p.minStock} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && !isError && (
              <div className="text-center py-12 text-[#5f6368]">No se encontraron productos</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
