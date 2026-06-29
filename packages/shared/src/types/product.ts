export interface ProductWithStock {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  categoryId: string | null;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}
