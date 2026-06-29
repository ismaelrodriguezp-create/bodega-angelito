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
  category_id: z.string().uuid({ message: 'Selecciona una categoría' }),
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

const inputClass =
  'w-full bg-[#f1f3f4] border-0 rounded-xl px-4 py-3 text-[14px] text-[#1f1f1f] placeholder-[#80868b] outline-none focus:ring-2 focus:ring-[#1a73e8] focus:bg-white transition-all';

const labelClass =
  'block text-[12px] font-semibold text-[#5f6368] uppercase tracking-wider mb-1.5';

export function ProductFormModal({ open, onClose }: ProductFormModalProps) {
  const { data: categories = [], isLoading: loadingCategories } = useCategories();
  const invalidateProducts = useInvalidateProducts();
  const [submitError, setSubmitError] = useState<string | null>(null);

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

    await invalidateProducts();
    reset();
    onClose();
  };

  const handleClose = () => {
    setSubmitError(null);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f1f3f4]">
          <h3 className="text-[17px] font-semibold text-[#1f1f1f]">Registrar Producto</h3>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full hover:bg-[#f1f3f4] flex items-center justify-center transition-colors text-[#5f6368]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {submitError && (
              <div className="bg-[#fce8e6] text-[#c5221f] text-[13px] px-4 py-3 rounded-xl">
                {submitError}
              </div>
            )}

            <div>
              <label className={labelClass}>Nombre del Producto</label>
              <input
                {...register('name')}
                className={inputClass}
                placeholder="Ej. Coca Cola 1.5L"
              />
              {errors.name && (
                <p className="text-[12px] text-[#c5221f] mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Marca</label>
                <input {...register('brand')} className={inputClass} placeholder="Ej. Coca Cola" />
              </div>
              <div>
                <label className={labelClass}>Categoría</label>
                <select
                  {...register('category_id')}
                  className={inputClass}
                  disabled={loadingCategories}
                >
                  <option value="">Seleccionar...</option>
                  {categories.map((c: Category) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="text-[12px] text-[#c5221f] mt-1">{errors.category_id.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Precio Venta (S/)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price')}
                  className={inputClass}
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-[12px] text-[#c5221f] mt-1">{errors.price.message}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>Costo (S/)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('cost')}
                  className={inputClass}
                  placeholder="0.00"
                />
                {errors.cost && (
                  <p className="text-[12px] text-[#c5221f] mt-1">{errors.cost.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Stock Inicial</label>
                <input
                  type="number"
                  {...register('initial_stock')}
                  className={inputClass}
                  placeholder="0"
                />
                {errors.initial_stock && (
                  <p className="text-[12px] text-[#c5221f] mt-1">{errors.initial_stock.message}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>Stock Mínimo</label>
                <input
                  type="number"
                  {...register('minimum_stock')}
                  className={inputClass}
                  placeholder="5"
                />
                {errors.minimum_stock && (
                  <p className="text-[12px] text-[#c5221f] mt-1">{errors.minimum_stock.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-[#f1f3f4] flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-full border border-[#dadce0] text-[14px] font-medium text-[#3c4043] hover:bg-[#f1f3f4] transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-full bg-[#1a73e8] text-white text-[14px] font-medium hover:bg-[#1557b0] transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
