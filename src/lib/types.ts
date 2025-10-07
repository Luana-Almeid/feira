

export type Product = {
  id: string;
  name: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  unit: 'unidade' | 'kg';
  category: 'Fruta' | 'Produto Processado' | 'Outro';
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

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  cpf: string;
  role: 'administrador' | 'funcionario';
  status: 'ativo' | 'inativo';
  dismissalDate?: string | null;
}
