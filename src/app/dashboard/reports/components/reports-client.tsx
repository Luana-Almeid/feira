
'use client';

import { useMemo } from 'react';
import { useCollection } from '@/hooks/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { type Transaction, type UserProfile } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionTable } from './transaction-table';
import { EmployeeActivityTable } from './employee-activity-table';

export function ReportsClient() {
  const transactionsQuery = useMemo(() => query(collection(db, 'transactions'), orderBy('date', 'desc')), []);
  const usersQuery = useMemo(() => query(collection(db, 'users'), orderBy('name')), []);

  const { data: transactions, loading: transactionsLoading } = useCollection<Transaction>(transactionsQuery);
  const { data: users, loading: usersLoading } = useCollection<UserProfile>(usersQuery);

  const loading = transactionsLoading || usersLoading;

  const sales = useMemo(() => transactions.filter(t => t.type === 'Venda'), [transactions]);
  const purchases = useMemo(() => transactions.filter(t => t.type === 'Compra'), [transactions]);
  const adjustments = useMemo(() => transactions.filter(t => t.type === 'Descarte'), [transactions]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sales">Vendas</TabsTrigger>
            <TabsTrigger value="purchases">Compras</TabsTrigger>
            <TabsTrigger value="adjustments">Ajustes/Descartes</TabsTrigger>
            <TabsTrigger value="employees">Funcionários</TabsTrigger>
        </TabsList>
        <TabsContent value="sales">
            <TransactionTable title="Histórico de Vendas" description="Todas as vendas registradas." transactions={sales} />
        </TabsContent>
        <TabsContent value="purchases">
            <TransactionTable title="Histórico de Compras" description="Todas as compras de fornecedores." transactions={purchases} />
        </TabsContent>
        <TabsContent value="adjustments">
            <TransactionTable title="Histórico de Ajustes e Descartes" description="Entradas e saídas manuais do estoque." transactions={adjustments} />
        </TabsContent>
        <TabsContent value="employees">
            <EmployeeActivityTable users={users} />
        </TabsContent>
    </Tabs>
  );
}
