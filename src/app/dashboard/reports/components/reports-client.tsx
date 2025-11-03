
'use client';

import { useMemo } from 'react';
import { useCollection } from '@/hooks/use-collection';
import { collection, query } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { type Transaction, type Product } from '@/lib/types';
import { StatCard } from '@/components/dashboard/stat-card';
import { DollarSign, Package, TrendingUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function ReportsClient() {
  const transactionsQuery = useMemo(() => query(collection(db, 'transactions')), []);
  const productsQuery = useMemo(() => query(collection(db, 'products')), []);

  const { data: transactions, loading: transactionsLoading } = useCollection<Transaction>(transactionsQuery);
  const { data: products, loading: productsLoading } = useCollection<Product>(productsQuery);

  const loading = transactionsLoading || productsLoading;

  const reportData = useMemo(() => {
    if (loading) return null;

    const sales = transactions.filter(t => t.type === 'Venda');
    
    const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);
    
    const productSales = new Map<string, { quantity: number, name: string }>();
    sales.forEach(sale => {
      sale.items.forEach(item => {
        const existing = productSales.get(item.productId);
        if (existing) {
          productSales.set(item.productId, { ...existing, quantity: existing.quantity + item.quantity });
        } else {
          productSales.set(item.productId, { quantity: item.quantity, name: item.productName });
        }
      });
    });

    let bestSellingProduct = { name: 'N/A', quantity: 0 };
    if(productSales.size > 0) {
      const sortedProducts = [...productSales.entries()].sort((a, b) => b[1].quantity - a[1].quantity);
      const [_, bestProductData] = sortedProducts[0];
      bestSellingProduct = bestProductData;
    }

    return {
      totalRevenue,
      bestSellingProduct,
    };
  }, [transactions, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
        <StatCard
          title="Receita Total (Vendas)"
          value={`R$ ${reportData?.totalRevenue.toFixed(2).replace('.', ',') ?? '0,00'}`}
          icon={DollarSign}
          description="Soma de todas as vendas registradas."
        />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produto Mais Vendido</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData?.bestSellingProduct.name}</div>
            <p className="text-xs text-muted-foreground">
              {reportData?.bestSellingProduct.quantity} unidades vendidas
            </p>
          </CardContent>
        </Card>
      </div>
       <Card>
          <CardHeader>
            <CardTitle>Em Breve</CardTitle>
            <CardDescription>
                Mais relatórios e análises detalhadas estarão disponíveis aqui.
            </CardDescription>
          </CardHeader>
           <CardContent>
                <p className="text-muted-foreground">Estamos trabalhando para trazer mais insights para o seu negócio!</p>
           </CardContent>
        </Card>
    </div>
  );
}
