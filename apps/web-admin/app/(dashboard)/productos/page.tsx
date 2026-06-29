'use client';

import { useMemo, useState } from 'react';
import { ProductCatalog } from '@/components/products/ProductCatalog';
import { ProductFormModal } from '@/components/products/ProductFormModal';
import { useProducts } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';

export default function ProductosPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: products = [], isLoading, isError, error } = useProducts();
  const { data: categories = [] } = useCategories();

  const categoryOptions = useMemo(
    () => ['Todos', ...categories.map((c) => c.name)],
    [categories]
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <ProductCatalog
        products={products}
        isLoading={isLoading}
        isError={isError}
        error={error}
        search={search}
        category={category}
        categoryOptions={categoryOptions}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onAddClick={() => setShowAddModal(true)}
      />
      <ProductFormModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
}
