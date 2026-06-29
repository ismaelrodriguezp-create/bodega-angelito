'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Upload, 
  Barcode, 
  Eye, 
  Check, 
  ChevronRight,
  Filter,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { formatCurrency, generateSKU } from '@bodega-angelito/shared';

interface DashboardProduct {
  id: string;
  barcode: string | null;
  sku: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  safetyStock: number;
}

// Datos estáticos de prueba (Mock Data) para fallback y demostración
const INITIAL_PRODUCTS: DashboardProduct[] = [
  { id: '1', barcode: '7801234567890', sku: 'BEB-COCA-3029', name: 'Coca Cola 1.5L', brand: 'Coca Cola', category: 'Bebidas', price: 1890, cost: 1200, stock: 45, minStock: 10, safetyStock: 3 },
  { id: '2', barcode: '7809876543210', sku: 'LAC-LECH-8839', name: 'Leche Entera Colun 1L', brand: 'Colun', category: 'Lácteos', price: 1050, cost: 750, stock: 4, minStock: 15, safetyStock: 5 },
  { id: '3', barcode: '7804561239870', sku: 'ABAR-ARRO-4592', name: 'Arroz Grado 1 Tucapel 1kg', brand: 'Tucapel', category: 'Abarrotes', price: 1350, cost: 900, stock: 80, minStock: 20, safetyStock: 8 },
  { id: '4', barcode: '7801112223334', sku: 'PAN-MOLD-7711', name: 'Pan de Molde Ideal Blanco', brand: 'Ideal', category: 'Panadería', price: 2190, cost: 1450, stock: 0, minStock: 8, safetyStock: 3 },
  { id: '5', barcode: '7806543210987', sku: 'LIM-LAVA-1294', name: 'Lavaloza Quix Limón 750ml', brand: 'Quix', category: 'Limpieza', price: 2490, cost: 1600, stock: 12, minStock: 5, safetyStock: 2 },
  { id: '6', barcode: '7803332221110', sku: 'LAC-QUES-6549', name: 'Queso Laminado Soprole 250g', brand: 'Soprole', category: 'Lácteos', price: 3200, cost: 2200, stock: 8, minStock: 10, safetyStock: 4 },
];

const CATEGORIES = ['Todos', 'Bebidas', 'Lácteos', 'Abarrotes', 'Panadería', 'Limpieza'];

export default function AdminDashboard() {
  const [products, setProducts] = useState<DashboardProduct[]>(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isCsvImportOpen, setIsCsvImportOpen] = useState(false);
  
  // Nuevo estado de producto
  const [newProduct, setNewProduct] = useState({
    name: '',
    barcode: '',
    brand: '',
    category: 'Abarrotes',
    price: '',
    cost: '',
    stock: '',
    minStock: '10'
  });

  const [scanResult, setScanResult] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Estadísticas del Inventario
  const totalSkuCount = products.length;
  const criticalStockCount = products.filter(p => p.stock <= p.minStock).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalValuation = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const totalCostValuation = products.reduce((sum, p) => sum + (p.cost * p.stock), 0);
  const expectedProfit = totalValuation - totalCostValuation;

  // Filtrado de catálogo
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.barcode && product.barcode.includes(searchQuery));
      
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Escáner de código de barras simulado
  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const randomBarcodes = ['7801234567890', '7809876543210', '7801112223334', '7801239998887'];
      const barcode = randomBarcodes[Math.floor(Math.random() * randomBarcodes.length)] || '7801239998887';
      
      setScanResult(barcode);
      setIsScanning(false);
      
      // Auto rellenar código en formulario si está abierto
      setNewProduct(prev => ({ ...prev, barcode }));
      
      // Si el código coincide con uno existente, buscarlo
      const found = products.find(p => p.barcode === barcode);
      if (found) {
        setSearchQuery(barcode);
      }
    }, 1500);
  };

  // Guardar producto nuevo
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.cost) return;

    const sku = generateSKU(newProduct.name, newProduct.category);
    const addedProduct = {
      id: String(products.length + 1),
      barcode: newProduct.barcode || null,
      sku,
      name: newProduct.name,
      brand: newProduct.brand || 'Genérico',
      category: newProduct.category,
      price: Number(newProduct.price),
      cost: Number(newProduct.cost),
      stock: Number(newProduct.stock) || 0,
      minStock: Number(newProduct.minStock) || 5,
      safetyStock: Math.ceil(Number(newProduct.minStock) * 0.3)
    };

    setProducts(prev => [addedProduct, ...prev]);
    setIsNewProductOpen(false);
    // Reset form
    setNewProduct({
      name: '',
      barcode: '',
      brand: '',
      category: 'Abarrotes',
      price: '',
      cost: '',
      stock: '',
      minStock: '10'
    });
  };

  // Simulación de carga masiva CSV
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [importedCount, setImportedCount] = useState(0);

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCsvFile(e.target.files[0]);
    }
  };

  const processCsv = () => {
    if (!csvFile) return;
    setImportStatus('loading');
    setTimeout(() => {
      // Simula insertar 3 nuevos productos desde el CSV
      const newItems = [
        { id: '101', barcode: '7801234000111', sku: 'ABAR-TALL-1922', name: 'Tallarines Lucchetti N°5 400g', brand: 'Lucchetti', category: 'Abarrotes', price: 990, cost: 650, stock: 120, minStock: 25, safetyStock: 8 },
        { id: '102', barcode: '7801234000222', sku: 'LAC-MANTE-8930', name: 'Mantequilla Soprole 250g', brand: 'Soprole', category: 'Lácteos', price: 2150, cost: 1500, stock: 15, minStock: 10, safetyStock: 3 },
        { id: '103', barcode: '7801234000333', sku: 'BEB-NECT-3940', name: 'Jugo Watts Naranja 1.5L', brand: 'Watts', category: 'Bebidas', price: 1100, cost: 720, stock: 35, minStock: 12, safetyStock: 4 },
      ];
      setProducts(prev => [...newItems, ...prev]);
      setImportedCount(newItems.length);
      setImportStatus('success');
      setTimeout(() => {
        setIsCsvImportOpen(false);
        setCsvFile(null);
        setImportStatus('idle');
      }, 2000);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Navbar Superior */}
      <header className="border-b border-border bg-slate-900/60 backdrop-blur sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-primary text-white p-2 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center">
              Angelito<span className="text-primary font-normal">Stock</span>
              <span className="ml-2 text-xs bg-slate-800 border border-border text-slate-400 px-2 py-0.5 rounded-full font-mono">Fase 1</span>
            </h1>
            <p className="text-xs text-muted-foreground">Panel de Control de Inventario</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={simulateScan} className="relative flex items-center gap-2">
            <Barcode className="w-4 h-4 text-primary" />
            <span>{isScanning ? 'Escaneando...' : 'Escanear Código'}</span>
          </Button>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center space-x-2 text-sm">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-300 font-medium">Supabase Conectado</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Banner de alerta stock crítico */}
        {criticalStockCount > 0 && (
          <div className="bg-amber-950/40 border border-amber-500/30 rounded-lg p-4 flex items-start space-x-3 text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Alerta de Stock Crítico</h3>
              <p className="text-xs text-amber-300/90 mt-0.5">
                Hay {criticalStockCount} productos en tu catálogo que se encuentran por debajo del stock mínimo configurado.
                Te sugerimos reabastecer a la brevedad.
              </p>
            </div>
            <Button variant="outline" size="sm" className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/20 text-xs shrink-0 self-center">
              Revisar Alertas
            </Button>
          </div>
        )}

        {/* Dashboard KPIs */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-900 border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Productos Activos</CardTitle>
              <Package className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">{totalSkuCount} SKUs</div>
              <CardDescription className="text-xs mt-1 text-slate-400 flex items-center">
                <span className="text-emerald-400 font-semibold flex items-center mr-1">
                  100%
                </span> 
                disponible online
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock Crítico</CardTitle>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">{criticalStockCount} items</div>
              <CardDescription className="text-xs mt-1 text-slate-400">
                {outOfStockCount} productos sin stock (agotado)
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Valor del Inventario</CardTitle>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">{formatCurrency(totalValuation)}</div>
              <CardDescription className="text-xs mt-1 text-slate-400">
                Costo total: {formatCurrency(totalCostValuation)}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Margen Esperado</CardTitle>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-100">{formatCurrency(expectedProfit)}</div>
              <CardDescription className="text-xs mt-1 text-slate-400">
                Retorno estimado del {Math.round((expectedProfit / totalValuation) * 100) || 0}%
              </CardDescription>
            </CardContent>
          </Card>
        </section>

        {/* Gráfico y Acciones Rápidas */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Custom SVG Analytics Chart */}
          <Card className="bg-slate-900 border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase text-slate-400 tracking-wider">Movimiento Diario y Ventas</CardTitle>
              <CardDescription>Resumen gráfico de rotación de productos en la última semana</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex flex-col justify-between">
              {/* Gráfico SVG interactivo de alta calidad */}
              <div className="relative w-full h-48 bg-slate-950/50 rounded border border-border/50 p-4 flex items-end">
                {/* Ejes y líneas de fondo */}
                <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-10">
                  <div className="border-b border-white w-full" />
                  <div className="border-b border-white w-full" />
                  <div className="border-b border-white w-full" />
                  <div className="border-b border-white w-full" />
                </div>

                <svg className="w-full h-full" viewBox="0 0 600 160" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Área rellenada */}
                  <path 
                    d="M0 160 Q 100 120, 200 80 T 400 40 T 600 110 L 600 160 L 0 160 Z" 
                    fill="url(#chartGradient)"
                  />
                  
                  {/* Línea principal */}
                  <path 
                    d="M0 160 Q 100 120, 200 80 T 400 40 T 600 110" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="3"
                  />
                  
                  {/* Puntos interactivos destacados */}
                  <circle cx="200" cy="80" r="5" fill="#60a5fa" stroke="#0f172a" strokeWidth="2" />
                  <circle cx="400" cy="40" r="5" fill="#60a5fa" stroke="#0f172a" strokeWidth="2" />
                  <circle cx="600" cy="110" r="5" fill="#3b82f6" stroke="#0f172a" strokeWidth="2" />
                </svg>

                {/* Etiquetas de datos encima de los puntos */}
                <div className="absolute left-[33%] top-[35%] bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[10px] text-slate-200 shadow font-mono">
                  $340k
                </div>
                <div className="absolute left-[66%] top-[10%] bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[10px] text-slate-200 shadow font-mono">
                  $510k (Pico)
                </div>
              </div>
              
              <div className="flex justify-between items-center text-xs text-slate-400 px-2 mt-2">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié (Stock Min)</span>
                <span>Jue</span>
                <span>Vie (Despachos)</span>
                <span>Sáb (Ventas)</span>
                <span>Dom</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Panel */}
          <Card className="bg-slate-900 border-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase text-slate-400 tracking-wider">Acciones de Gestión</CardTitle>
              <CardDescription>Accesos directos para control rápido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => setIsNewProductOpen(true)}
                className="w-full flex items-center justify-between text-left h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                <span className="flex items-center gap-3">
                  <Plus className="w-5 h-5" />
                  Añadir Producto
                </span>
                <ChevronRight className="w-4 h-4 opacity-75" />
              </Button>

              <Button 
                onClick={() => setIsCsvImportOpen(true)}
                variant="outline" 
                className="w-full flex items-center justify-between text-left h-12 border-slate-700 text-slate-200 hover:bg-slate-800"
              >
                <span className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-indigo-400" />
                  Importar CSV de Stock
                </span>
                <ChevronRight className="w-4 h-4 opacity-75" />
              </Button>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Simulación de Escaneo</h4>
                {scanResult ? (
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">Resultado Escáner</p>
                      <p className="text-sm font-mono font-semibold text-slate-200">{scanResult}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setScanResult('')} className="text-xs text-slate-400 p-0 h-auto hover:bg-transparent hover:text-white">
                      Limpiar
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No se ha registrado ningún código recientemente.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Tabla de Catálogo de Productos */}
        <section className="bg-slate-900 border border-border rounded-lg overflow-hidden">
          {/* Header de la Tabla */}
          <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/60">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Catálogo de Productos</h2>
              <p className="text-xs text-muted-foreground">Listado general de stock y auditoría de inventario</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Barra de Búsqueda */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por SKU, nombre, barra..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Filtro de Categoría */}
              <div className="relative w-full sm:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tabla de Datos */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-slate-950/40 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">SKU / Barra</th>
                  <th className="p-4">Nombre Producto</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4 text-right">Precio</th>
                  <th className="p-4 text-right">Costo</th>
                  <th className="p-4 text-center">Stock Nivel</th>
                  <th className="p-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => {
                    const isCritical = product.stock <= product.minStock;
                    const isOutOfStock = product.stock === 0;

                    return (
                      <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <div className="font-mono text-xs font-semibold text-slate-200">{product.sku}</div>
                          {product.barcode && (
                            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                              <Barcode className="w-3 h-3" />
                              {product.barcode}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-slate-100">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.brand}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-4 text-right font-semibold text-slate-200">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="p-4 text-right text-slate-400">
                          {formatCurrency(product.cost)}
                        </td>
                        <td className="p-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className={`font-semibold text-sm ${isOutOfStock ? 'text-red-500' : isCritical ? 'text-amber-500' : 'text-slate-200'}`}>
                              {product.stock} un.
                            </span>
                            <span className="text-[10px] text-slate-500">Mín: {product.minStock}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          {isOutOfStock ? (
                            <span className="px-2 py-1 rounded-full text-[10px] font-bold tracking-wider bg-red-950 text-red-400 border border-red-800/50">
                              AGOTADO
                            </span>
                          ) : isCritical ? (
                            <span className="px-2 py-1 rounded-full text-[10px] font-bold tracking-wider bg-amber-950 text-amber-400 border border-amber-800/50">
                              CRÍTICO
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-[10px] font-bold tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                              ÓPTIMO
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500 italic">
                      No se encontraron productos que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* MODAL: Nuevo Producto */}
      {isNewProductOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg bg-slate-900 border-slate-700 shadow-2xl">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-lg text-slate-100 flex items-center justify-between">
                <span>Registrar Nuevo Producto</span>
                <Button variant="ghost" size="sm" onClick={() => setIsNewProductOpen(false)} className="text-slate-400 hover:text-white">✕</Button>
              </CardTitle>
              <CardDescription>Añade un nuevo SKU al catálogo general de la bodega.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveProduct}>
              <CardContent className="space-y-4 pt-6">
                
                {/* Nombre */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Nombre del Producto *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej. Tallarines Lucchetti N°5"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Marca y Categoría */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Marca</label>
                    <input
                      type="text"
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, brand: e.target.value }))}
                      placeholder="Ej. Lucchetti"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Categoría</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {CATEGORIES.filter(c => c !== 'Todos').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Código de barras (con simulador) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Código de Barras (EAN/UPC)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newProduct.barcode}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, barcode: e.target.value }))}
                      placeholder="Ej. 7801234567890"
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <Button type="button" variant="outline" onClick={simulateScan} className="flex gap-1 items-center px-3 text-xs border-slate-700 text-slate-200">
                      <Barcode className="w-4 h-4 text-primary" />
                      Escanear
                    </Button>
                  </div>
                </div>

                {/* Precios y Costos */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Precio de Venta ($) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="Ej. 1350"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Costo Neto ($) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newProduct.cost}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, cost: e.target.value }))}
                      placeholder="Ej. 900"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Stock inicial y Mínimo */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Stock Inicial (un.)</label>
                    <input
                      type="number"
                      min="0"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                      placeholder="Ej. 50"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Stock Mínimo Alerta</label>
                    <input
                      type="number"
                      min="0"
                      value={newProduct.minStock}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, minStock: e.target.value }))}
                      placeholder="Ej. 10"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

              </CardContent>
              <div className="p-6 border-t border-slate-800 flex justify-end space-x-3 bg-slate-950/40">
                <Button type="button" variant="ghost" onClick={() => setIsNewProductOpen(false)} className="text-slate-400 hover:text-white">
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary text-white hover:bg-primary/90 font-medium">
                  Guardar Producto
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL: Importación CSV */}
      {isCsvImportOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-slate-900 border-slate-700 shadow-2xl">
            <CardHeader className="border-b border-slate-800">
              <CardTitle className="text-lg text-slate-100 flex items-center justify-between">
                <span>Carga Masiva de Stock</span>
                <Button variant="ghost" size="sm" onClick={() => setIsCsvImportOpen(false)} className="text-slate-400 hover:text-white">✕</Button>
              </CardTitle>
              <CardDescription>Carga un archivo CSV o Excel para poblar el inventario.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="border-2 border-dashed border-slate-700 hover:border-primary/50 transition-colors rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer relative bg-slate-950/40">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleCsvUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-10 h-10 text-indigo-400 mb-3" />
                <p className="text-sm font-semibold text-slate-300">
                  {csvFile ? csvFile.name : 'Arrastra tu archivo aquí o haz clic'}
                </p>
                <p className="text-xs text-slate-500 mt-1">Soporta formatos .csv, .xlsx de hasta 5MB</p>
              </div>

              {csvFile && importStatus === 'idle' && (
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-850 flex items-center justify-between">
                  <div className="flex flex-col text-left">
                    <span className="text-xs text-slate-400 font-mono">Archivo listo</span>
                    <span className="text-sm text-slate-200 font-semibold">{csvFile.name}</span>
                  </div>
                  <Button onClick={processCsv} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 h-8">
                    Procesar
                  </Button>
                </div>
              )}

              {importStatus === 'loading' && (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <RefreshCw className="w-8 h-8 text-primary animate-spin mb-3" />
                  <p className="text-sm text-slate-300 font-medium">Validando datos e importando catálogo...</p>
                  <p className="text-xs text-slate-500 mt-1">Conectando con Supabase Edge Function</p>
                </div>
              )}

              {importStatus === 'success' && (
                <div className="flex flex-col items-center justify-center py-6 text-center text-emerald-400">
                  <div className="bg-emerald-950 border border-emerald-500/30 p-2.5 rounded-full mb-3">
                    <Check className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold">¡Carga Completada con Éxito!</p>
                  <p className="text-xs text-emerald-500/80 mt-1">Se agregaron {importedCount} nuevos productos a la sucursal.</p>
                </div>
              )}

              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-left">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Formato de Columnas Requerido
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  El archivo debe contener las siguientes columnas exactas:
                  <code className="block bg-slate-900 p-1.5 rounded text-indigo-300 font-mono mt-1 text-[10px]">
                    barcode, sku, name, brand, category, price, cost, stock
                  </code>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
