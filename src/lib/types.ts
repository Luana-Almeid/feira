
export type ProductImage = {
  imageUrl: string;
  imageHint: string;
};

export type Product = {
  id: string;
  name: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  unit: 'unidade' | 'kg' | 'caixa';
  category: 'Fruta' | 'Produto Processado' | 'Outro';
  image: ProductImage;
  lowStockThreshold: number;
};

export type TransactionItem = {
  product: Product;
  quantity: number;
  unitPrice: number;
};

export type Transaction = {
  id: string;
  type: 'Venda' | 'Compra' | 'Descarte';
  date: string;
  items: TransactionItem[];
  total: number;
  reason?: string; // for discards
};
