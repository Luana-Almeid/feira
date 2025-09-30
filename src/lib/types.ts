import type { ImagePlaceholder } from './placeholder-images';

export type Product = {
  id: string;
  name: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  category: 'Fruta' | 'Produto Processado' | 'Outro';
  image: ImagePlaceholder;
  lowStockThreshold: number;
};

export type Transaction = {
  id: string;
  type: 'Venda' | 'Compra' | 'Descarte';
  date: string;
  items: {
    product: Product;
    quantity: number;
    unitPrice: number;
  }[];
  total: number;
  reason?: string; // for discards
};
