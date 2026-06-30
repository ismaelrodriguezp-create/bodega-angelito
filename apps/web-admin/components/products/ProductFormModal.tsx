'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ProductWithStockSchemaInput } from '@bodega-angelito/shared';
import { createProduct } from '../../app/actions/products';
import { useCategories } from '../../hooks/use-categories';
import { useInvalidateProducts } from '../../hooks/use-products';
import type { Category } from '@bodega-angelito/shared';

const productFormSchema = z.object({
  name: z.string().trim().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  brand: z.string().trim().optional().or(z.literal('')),
  // Acepta UUID real o cualquier string no vacío para compatibilidad con mock y Supabase
  category_id: z.string().min(1, { message: 'Selecciona una categoría' }),
  price: z.coerce.number().min(0, { message: 'El precio debe ser mayor o igual a 0' }),
  cost: z.coerce.number().min(0, { message: 'El costo debe ser mayor o igual a 0' }),
  initial_stock: z.coerce.number().int().min(0, { message: 'El stock inicial debe ser mayor o igual a 0' }),
  minimum_stock: z.coerce.number().int().min(0, { message: 'El stock mínimo debe ser mayor o igual a 0' }),
  safety_stock: z.coerce.number().int().min(0, { message: 'El stock de seguridad debe ser mayor o igual a 0' }),
  sku: z.string().trim().optional().or(z.literal('')),
  is_active: z.boolean(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProductFormModal({ open, onClose }: ProductFormModalProps) {
  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const invalidateProducts = useInvalidateProducts();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      brand: '',
      category_id: '',
      price: 0,
      cost: 0,
      initial_stock: 0,
      minimum_stock: 5,
      safety_stock: 2,
      sku: '',
      is_active: true,
    },
  });

  if (!open) return null;

  const onSubmit = async (values: ProductFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(false);
    const payload: ProductWithStockSchemaInput = {
      ...values,
      category_id: values.category_id,
      sku: values.sku || undefined,
    };
    const result = await createProduct(payload);

    if (!result.success) {
      setSubmitError(result.error);
      return;
    }

    setSubmitSuccess(true);
    await invalidateProducts();
    setTimeout(() => {
      reset();
      setSubmitSuccess(false);
      onClose();
    }, 800);
  };

  const handleClose = () => {
    setSubmitError(null);
    setSubmitSuccess(false);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-xl rounded-t-[28px] sm:rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          border: '1px solid rgba(99,102,241,0.25)',
        }}
      >
        {/* Decorative top gradient bar */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)' }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-white">Registrar Producto</h3>
              <p className="text-[12px] text-slate-400">Complete los datos del nuevo producto</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.08)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 pb-2 space-y-4 max-h-[65vh] overflow-y-auto"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(99,102,241,0.3) transparent' }}>

            {/* Alerts */}
            {submitError && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2" />
                  <line x1="12" y1="8" x2="12" y2="12" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                  <line x1="12" y1="16" x2="12.01" y2="16" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <p className="text-[13px] text-red-300">{submitError}</p>
              </div>
            )}
            {submitSuccess && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" />
                  <polyline points="9 12 11 14 15 10" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-[13px] text-emerald-300">¡Producto registrado exitosamente!</p>
              </div>
            )}

            {/* Nombre */}
            <FieldWrapper label="Nombre del Producto" required error={errors.name?.message}>
              <DarkInput
                {...register('name')}
                placeholder="Ej. Coca Cola 1.5L"
              />
            </FieldWrapper>

            {/* Marca + Categoría */}
            <div className="grid grid-cols-2 gap-3">
              <FieldWrapper label="Marca" error={undefined}>
                <DarkInput {...register('brand')} placeholder="Ej. Coca Cola" />
              </FieldWrapper>
              <FieldWrapper label="Categoría" required error={errors.category_id?.message}>
                <DarkSelect
                  {...register('category_id')}
                  disabled={loadingCategories}
                >
                  <option value="">
                    {loadingCategories ? 'Cargando...' : 'Seleccionar...'}
                  </option>
                  {categories.map((c: Category) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </DarkSelect>
              </FieldWrapper>
            </div>

            {/* Precio + Costo */}
            <div className="grid grid-cols-2 gap-3">
              <FieldWrapper label="Precio Venta (S/)" required error={errors.price?.message}>
                <DarkInput
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price')}
                  placeholder="0.00"
                />
              </FieldWrapper>
              <FieldWrapper label="Costo (S/)" required error={errors.cost?.message}>
                <DarkInput
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('cost')}
                  placeholder="0.00"
                />
              </FieldWrapper>
            </div>

            {/* Stock Inicial + Mínimo */}
            <div className="grid grid-cols-2 gap-3">
              <FieldWrapper label="Stock Inicial" error={errors.initial_stock?.message}>
                <DarkInput
                  type="number"
                  min="0"
                  {...register('initial_stock')}
                  placeholder="0"
                />
              </FieldWrapper>
              <FieldWrapper label="Stock Mínimo" error={errors.minimum_stock?.message}>
                <DarkInput
                  type="number"
                  min="0"
                  {...register('minimum_stock')}
                  placeholder="5"
                />
              </FieldWrapper>
            </div>

            {/* SKU (opcional) */}
            <FieldWrapper label="SKU (opcional)" error={undefined}>
              <DarkInput
                {...register('sku')}
                placeholder="Se genera automáticamente si no completas"
              />
            </FieldWrapper>
          </div>

          {/* Footer Buttons */}
          <div className="px-6 py-4 flex gap-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-2xl text-[14px] font-semibold transition-all disabled:opacity-40"
              style={{ background: 'rgba(255,255,255,0.07)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)';
                (e.currentTarget as HTMLButtonElement).style.color = '#e2e8f0';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || submitSuccess}
              className="flex-1 py-3 rounded-2xl text-[14px] font-bold text-white shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 8px 25px -8px rgba(99,102,241,0.6)',
              }}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Guardando...
                </>
              ) : submitSuccess ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  ¡Listo!
                </>
              ) : (
                'Guardar Producto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Subcomponentes internos ────────────────────────────────────────────────

function FieldWrapper({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5"
        style={{ color: '#64748b' }}>
        {label}{required && <span style={{ color: '#6366f1' }}> *</span>}
      </label>
      {children}
      {error && (
        <p className="text-[11px] mt-1.5 flex items-center gap-1" style={{ color: '#f87171' }}>
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

import { forwardRef } from 'react';

const DarkInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function DarkInput(props, ref) {
    return (
      <input
        ref={ref}
        {...props}
        className="w-full rounded-xl px-4 py-2.5 text-[13px] font-medium outline-none transition-all"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#e2e8f0',
          caretColor: '#6366f1',
        }}
        onFocus={e => {
          e.currentTarget.style.border = '1px solid rgba(99,102,241,0.6)';
          e.currentTarget.style.background = 'rgba(99,102,241,0.08)';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)';
        }}
        onBlur={e => {
          e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
    );
  }
);

const DarkSelect = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function DarkSelect({ children, ...props }, ref) {
    return (
      <select
        ref={ref}
        {...props}
        className="w-full rounded-xl px-4 py-2.5 text-[13px] font-medium outline-none transition-all appearance-none cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#e2e8f0',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          paddingRight: '36px',
        }}
        onFocus={e => {
          e.currentTarget.style.border = '1px solid rgba(99,102,241,0.6)';
          e.currentTarget.style.background = 'rgba(99,102,241,0.08)';
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)';
        }}
        onBlur={e => {
          e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)';
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {children}
      </select>
    );
  }
);
