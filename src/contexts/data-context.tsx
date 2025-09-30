'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { products as initialProducts, transactions as initialTransactions } from '@/lib/data';
import type { Product, Transaction } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface DataContextType {
  products: Product[];
  transactions: Transaction[];
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  addTransaction: (transaction: Transaction) => void;
  adjustStock: (productId: string, quantity: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const { toast } = useToast();

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  const updateProduct = (productId: string, updatedFields: Partial<Product>) => {
    setProducts((prev) => 
      prev.map((p) => (p.id === productId ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    toast({ title: "Produto excluído", description: "O produto foi removido do seu inventário."});
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  const adjustStock = (productId: string, quantity: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newStock = p.stock + quantity;
          if (newStock < 0) {
              throw new Error(`Estoque insuficiente para ${p.name}. Apenas ${p.stock} disponíveis.`);
          }
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  return (
    <DataContext.Provider 
        value={{ 
            products, 
            transactions, 
            addProduct, 
            updateProduct,
            deleteProduct,
            addTransaction,
            adjustStock 
        }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
