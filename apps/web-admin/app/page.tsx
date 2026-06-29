'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@bodega-angelito/shared';
import { SalesOverviewChart } from '../components/dashboard/SalesOverviewChart';
import { TopProductsChart } from '../components/dashboard/TopProductsChart';
import { SalesByCategoryChart } from '../components/dashboard/SalesByCategoryChart';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  { id: '1', sku: 'BEB-COLA-001', name: 'Coca Cola 1.5L', brand: 'Coca Cola', category: 'Bebidas', price: 5500, cost: 3800, stock: 45, minStock: 10 },
  { id: '2', sku: 'LAC-LECH-002', name: 'Leche Gloria Evaporada', brand: 'Gloria', category: 'Lácteos', price: 3200, cost: 2100, stock: 4, minStock: 15 },
  { id: '3', sku: 'ABA-ARRO-003', name: 'Arroz Costeño 1kg', brand: 'Costeño', category: 'Abarrotes', price: 4800, cost: 3200, stock: 80, minStock: 20 },
  { id: '4', sku: 'PAN-MOLD-004', name: 'Panetón D\'Onofrio 900g', brand: 'D\'Onofrio', category: 'Panadería', price: 19900, cost: 14000, stock: 0, minStock: 8 },
  { id: '5', sku: 'LIM-LAVA-005', name: 'Sapolio Lejía 2L', brand: 'Sapolio', category: 'Limpieza', price: 8900, cost: 6200, stock: 12, minStock: 5 },
  { id: '6', sku: 'BEB-INKA-006', name: 'Inka Cola 3L', brand: 'Inka Cola', category: 'Bebidas', price: 9200, cost: 6500, stock: 8, minStock: 10 },
];

const CATEGORIES = ['Todos', 'Bebidas', 'Lácteos', 'Abarrotes', 'Panadería', 'Limpieza'];

// ─── KPI Data ─────────────────────────────────────────────────────────────────

const KPI_DATA = [
  {
    label: 'Ingresos del Mes',
    value: 'S/ 24,850',
    change: '+18.2%',
    positive: true,
    sub: 'vs mes anterior',
    color: '#1a73e8',
    bg: '#e8f0fe',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Pedidos Activos',
    value: '47',
    change: '+12 hoy',
    positive: true,
    sub: 'en proceso',
    color: '#1e8e3e',
    bg: '#e6f4ea',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="2"/>
        <circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="2"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Stock Crítico',
    value: '5 items',
    change: '2 agotados',
    positive: false,
    sub: 'requieren atención',
    color: '#d93025',
    bg: '#fce8e6',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Clientes Nuevos',
    value: '203',
    change: '+24%',
    positive: true,
    sub: 'este mes',
    color: '#8430ce',
    bg: '#f3e8fd',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
];

// ─── Components ───────────────────────────────────────────────────────────────

function StatusBadge({ stock, minStock }: { stock: number; minStock: number }) {
  if (stock === 0)
    return <span className="px-2.5 py-1 bg-[#fce8e6] text-[#d93025] text-[11px] font-semibold rounded-full">Agotado</span>;
  if (stock <= minStock)
    return <span className="px-2.5 py-1 bg-[#fef7e0] text-[#b06000] text-[11px] font-semibold rounded-full">Crítico</span>;
  return <span className="px-2.5 py-1 bg-[#e6f4ea] text-[#1e8e3e] text-[11px] font-semibold rounded-full">Óptimo</span>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = PRODUCTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Todos' || p.category === category;
    return matchSearch && matchCat;
  });

  const totalValuation = PRODUCTS.reduce((s, p) => s + p.price * p.stock, 0);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 animate-in">

      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[22px] md:text-[28px] font-semibold text-[#1f1f1f] leading-tight">
            Bienvenido de vuelta 👋
          </h1>
          <p className="text-[14px] text-[#5f6368] mt-0.5">
            {new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[14px] font-medium px-5 py-2.5 rounded-full shadow-sm transition-all active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_DATA.map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 md:p-5 border border-[#dadce0] shadow-sm hover:shadow-md transition-all cursor-default">
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: kpi.bg, color: kpi.color }}
              >
                {kpi.icon}
              </div>
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: kpi.positive ? '#e6f4ea' : '#fce8e6', color: kpi.positive ? '#1e8e3e' : '#d93025' }}
              >
                {kpi.change}
              </span>
            </div>
            <div className="text-[22px] md:text-[26px] font-semibold text-[#1f1f1f] leading-tight">{kpi.value}</div>
            <div className="text-[12px] md:text-[13px] text-[#5f6368] mt-1">{kpi.label}</div>
            <div className="text-[11px] text-[#80868b] mt-0.5">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Charts Row 1: Sales Trend + Category Donut ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Overview spans 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#dadce0] shadow-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-[16px] font-semibold text-[#1f1f1f]">Tendencia de Ventas</h2>
              <p className="text-[13px] text-[#5f6368]">Últimos 7 días</p>
            </div>
            <span className="text-[12px] text-[#1a73e8] font-medium cursor-pointer hover:underline">Ver detalle</span>
          </div>
          <SalesOverviewChart />
        </div>

        {/* Category donut */}
        <div className="bg-white rounded-2xl border border-[#dadce0] shadow-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-[16px] font-semibold text-[#1f1f1f]">Por Categoría</h2>
              <p className="text-[13px] text-[#5f6368]">Distribución de ventas</p>
            </div>
          </div>
          <SalesByCategoryChart />
        </div>
      </div>

      {/* ── Charts Row 2: Top Products + Inventory Summary ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top products */}
        <div className="bg-white rounded-2xl border border-[#dadce0] shadow-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-[16px] font-semibold text-[#1f1f1f]">Top Productos</h2>
              <p className="text-[13px] text-[#5f6368]">Más vendidos este mes</p>
            </div>
            <span className="text-[12px] text-[#1a73e8] font-medium cursor-pointer hover:underline">Ver todos</span>
          </div>
          <TopProductsChart />
        </div>

        {/* Inventory & Quick Actions */}
        <div className="lg:col-span-2 grid grid-rows-2 gap-4">
          {/* Inventory Summary Card */}
          <div className="bg-white rounded-2xl border border-[#dadce0] shadow-sm p-5">
            <h2 className="text-[16px] font-semibold text-[#1f1f1f] mb-4">Resumen de Inventario</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-[#f8f9fa] rounded-xl">
                <div className="text-[24px] font-semibold text-[#1f1f1f]">{PRODUCTS.length}</div>
                <div className="text-[12px] text-[#5f6368] mt-0.5">SKUs Activos</div>
              </div>
              <div className="text-center p-3 bg-[#fce8e6] rounded-xl">
                <div className="text-[24px] font-semibold text-[#d93025]">{PRODUCTS.filter(p => p.stock <= p.minStock).length}</div>
                <div className="text-[12px] text-[#d93025] mt-0.5">Stock Crítico</div>
              </div>
              <div className="text-center p-3 bg-[#e6f4ea] rounded-xl">
                <div className="text-[20px] font-semibold text-[#1e8e3e]">{formatCurrency(totalValuation)}</div>
                <div className="text-[12px] text-[#1e8e3e] mt-0.5">Valor Total</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-[#dadce0] shadow-sm p-5">
            <h2 className="text-[16px] font-semibold text-[#1f1f1f] mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Agregar Producto', color: '#1a73e8', bg: '#e8f0fe', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>, action: () => setShowAddModal(true) },
                { label: 'Importar CSV', color: '#8430ce', bg: '#f3e8fd', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>, action: () => {} },
                { label: 'Ver Pedidos', color: '#1e8e3e', bg: '#e6f4ea', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="21" r="1" stroke="currentColor" strokeWidth="2"/><circle cx="20" cy="21" r="1" stroke="currentColor" strokeWidth="2"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, action: () => {} },
                { label: 'Alertas Stock', color: '#d93025', bg: '#fce8e6', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>, action: () => {} },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={action.action}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-[#f8f9fa] transition-all active:scale-95 text-center"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: action.bg, color: action.color }}
                  >
                    {action.icon}
                  </div>
                  <span className="text-[12px] font-medium text-[#3c4043] leading-tight">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Product Catalog Table ────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#dadce0] shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="p-5 border-b border-[#f1f3f4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1f1f1f]">Catálogo de Productos</h2>
            <p className="text-[13px] text-[#5f6368]">{PRODUCTS.length} productos registrados</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center bg-[#f1f3f4] rounded-full px-3 h-9 gap-2 w-full sm:w-56">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#5f6368] flex-shrink-0">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent text-[13px] text-[#1f1f1f] placeholder-[#5f6368] outline-none w-full"
                placeholder="Buscar..."
              />
            </div>
            {/* Category filter */}
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="bg-[#f1f3f4] text-[13px] text-[#3c4043] rounded-full h-9 px-3 outline-none border-none cursor-pointer"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Table - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#f1f3f4]">
                <th className="px-5 py-3 text-[11px] font-semibold text-[#80868b] uppercase tracking-wider">Producto</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[#80868b] uppercase tracking-wider">Categoría</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[#80868b] uppercase tracking-wider text-right">Precio</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[#80868b] uppercase tracking-wider text-center">Stock</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-[#80868b] uppercase tracking-wider text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} className={`border-b border-[#f1f3f4] hover:bg-[#f8f9fa] transition-colors cursor-pointer ${i === filtered.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-[14px] text-[#1f1f1f]">{p.name}</div>
                    <div className="text-[12px] text-[#5f6368] font-mono mt-0.5">{p.sku} · {p.brand}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="bg-[#f1f3f4] text-[#3c4043] text-[12px] font-medium px-2.5 py-1 rounded-full">{p.category}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="text-[14px] font-semibold text-[#1f1f1f]">{formatCurrency(p.price)}</div>
                    <div className="text-[11px] text-[#5f6368]">Costo: {formatCurrency(p.cost)}</div>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <div className="text-[14px] font-semibold text-[#1f1f1f]">{p.stock} un.</div>
                    <div className="text-[11px] text-[#80868b]">Mín: {p.minStock}</div>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <StatusBadge stock={p.stock} minStock={p.minStock} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#5f6368]">
              <svg className="mx-auto mb-3 text-[#dadce0]" width="40" height="40" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p className="text-[14px]">No se encontraron productos</p>
            </div>
          )}
        </div>

        {/* Table - Mobile Cards */}
        <div className="md:hidden divide-y divide-[#f1f3f4]">
          {filtered.map(p => (
            <div key={p.id} className="p-4 hover:bg-[#f8f9fa] transition-colors cursor-pointer">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[14px] text-[#1f1f1f] truncate">{p.name}</div>
                  <div className="text-[12px] text-[#5f6368] mt-0.5">{p.brand} · {p.category}</div>
                </div>
                <StatusBadge stock={p.stock} minStock={p.minStock} />
              </div>
              <div className="flex items-center justify-between mt-3 text-[13px]">
                <span className="font-semibold text-[#1a73e8]">{formatCurrency(p.price)}</span>
                <span className="text-[#5f6368]">Stock: <strong className="text-[#1f1f1f]">{p.stock}</strong> un.</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Add Product Modal ────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f3f4]">
              <h3 className="text-[17px] font-semibold text-[#1f1f1f]">Registrar Producto</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#f1f3f4] flex items-center justify-center transition-colors text-[#5f6368]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-[12px] font-semibold text-[#5f6368] uppercase tracking-wider mb-1.5">Nombre del Producto</label>
                <input className="w-full bg-[#f1f3f4] border-0 rounded-xl px-4 py-3 text-[14px] text-[#1f1f1f] placeholder-[#80868b] outline-none focus:ring-2 focus:ring-[#1a73e8] focus:bg-white transition-all" placeholder="Ej. Coca Cola 1.5L" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#5f6368] uppercase tracking-wider mb-1.5">Marca</label>
                  <input className="w-full bg-[#f1f3f4] border-0 rounded-xl px-4 py-3 text-[14px] text-[#1f1f1f] placeholder-[#80868b] outline-none focus:ring-2 focus:ring-[#1a73e8] focus:bg-white transition-all" placeholder="Ej. Coca Cola" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#5f6368] uppercase tracking-wider mb-1.5">Categoría</label>
                  <select className="w-full bg-[#f1f3f4] border-0 rounded-xl px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:ring-2 focus:ring-[#1a73e8] focus:bg-white transition-all">
                    {CATEGORIES.filter(c => c !== 'Todos').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#5f6368] uppercase tracking-wider mb-1.5">Precio Venta (S/)</label>
                  <input type="number" className="w-full bg-[#f1f3f4] border-0 rounded-xl px-4 py-3 text-[14px] text-[#1f1f1f] placeholder-[#80868b] outline-none focus:ring-2 focus:ring-[#1a73e8] focus:bg-white transition-all" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#5f6368] uppercase tracking-wider mb-1.5">Costo (S/)</label>
                  <input type="number" className="w-full bg-[#f1f3f4] border-0 rounded-xl px-4 py-3 text-[14px] text-[#1f1f1f] placeholder-[#80868b] outline-none focus:ring-2 focus:ring-[#1a73e8] focus:bg-white transition-all" placeholder="0.00" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#5f6368] uppercase tracking-wider mb-1.5">Stock Inicial</label>
                  <input type="number" className="w-full bg-[#f1f3f4] border-0 rounded-xl px-4 py-3 text-[14px] text-[#1f1f1f] placeholder-[#80868b] outline-none focus:ring-2 focus:ring-[#1a73e8] focus:bg-white transition-all" placeholder="0" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#5f6368] uppercase tracking-wider mb-1.5">Stock Mínimo</label>
                  <input type="number" className="w-full bg-[#f1f3f4] border-0 rounded-xl px-4 py-3 text-[14px] text-[#1f1f1f] placeholder-[#80868b] outline-none focus:ring-2 focus:ring-[#1a73e8] focus:bg-white transition-all" placeholder="5" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#f1f3f4] flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 rounded-full border border-[#dadce0] text-[14px] font-medium text-[#3c4043] hover:bg-[#f1f3f4] transition-colors">
                Cancelar
              </button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 rounded-full bg-[#1a73e8] text-white text-[14px] font-medium hover:bg-[#1557b0] transition-colors shadow-sm">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
