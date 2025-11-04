
'use client';

import { useMemo, useState } from 'react';
import { useCollection } from '@/hooks/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { type Transaction, type UserProfile } from '@/lib/types';
import { Loader2, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionTable } from './transaction-table';
import { EmployeeActivityTable } from './employee-activity-table';
import { Input } from '@/components/ui/input';
import { useSortableData, type SortDescriptor } from '@/hooks/use-sortable-data';

export function ReportsClient() {
  const [activeTab, setActiveTab] = useState('sales');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor | null>(null);

  const transactionsQuery = useMemo(() => query(collection(db, 'transactions'), orderBy('date', 'desc')), []);
  const usersQuery = useMemo(() => query(collection(db, 'users'), orderBy('name')), []);

  const { data: transactions, loading: transactionsLoading } = useCollection<Transaction>(transactionsQuery);
  const { data: users, loading: usersLoading } = useCollection<UserProfile>(usersQuery);

  const loading = transactionsLoading || usersLoading;

  const sales = useMemo(() => transactions.filter(t => t.type === 'Venda'), [transactions]);
  const purchases = useMemo(() => transactions.filter(t => t.type === 'Compra'), [transactions]);
  const adjustments = useMemo(() => transactions.filter(t => t.type === 'Descarte'), [transactions]);
  
  const searchKeysMap = {
    sales: ['userName', 'items.productName'],
    purchases: ['userName', 'items.productName'],
    adjustments: ['userName', 'items.productName', 'reason'],
    employees: ['name', 'email', 'cpf', 'role']
  };

  const currentData = useMemo(() => {
    switch(activeTab) {
      case 'sales': return sales;
      case 'purchases': return purchases;
      case 'adjustments': return adjustments;
      case 'employees': return users;
      default: return [];
    }
  }, [activeTab, sales, purchases, adjustments, users]);

  const { sortedData } = useSortableData(currentData, sortDescriptor, searchTerm, searchKeysMap[activeTab as keyof typeof searchKeysMap]);


  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchTerm('');
    setSortDescriptor(null);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="sales">Vendas</TabsTrigger>
                <TabsTrigger value="purchases">Compras</TabsTrigger>
                <TabsTrigger value="adjustments">Ajustes/Descartes</TabsTrigger>
                <TabsTrigger value="employees">Funcionários</TabsTrigger>
            </TabsList>

            <div className="relative my-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Buscar em todos os campos..." 
                    className="pl-10 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <TabsContent value="sales" forceMount={true} className={activeTab === 'sales' ? 'block' : 'hidden'}>
                <TransactionTable 
                    title="Histórico de Vendas" 
                    description="Todas as vendas registradas." 
                    transactions={sortedData as Transaction[]} 
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                />
            </TabsContent>
            <TabsContent value="purchases" forceMount={true} className={activeTab === 'purchases' ? 'block' : 'hidden'}>
                <TransactionTable 
                    title="Histórico de Compras" 
                    description="Todas as compras de fornecedores." 
                    transactions={sortedData as Transaction[]} 
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                />
            </TabsContent>
            <TabsContent value="adjustments" forceMount={true} className={activeTab === 'adjustments' ? 'block' : 'hidden'}>
                <TransactionTable 
                    title="Histórico de Ajustes e Descartes" 
                    description="Entradas e saídas manuais do estoque." 
                    transactions={sortedData as Transaction[]} 
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                />
            </TabsContent>
            <TabsContent value="employees" forceMount={true} className={activeTab === 'employees' ? 'block' : 'hidden'}>
                <EmployeeActivityTable 
                    users={sortedData as UserProfile[]} 
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                />
            </TabsContent>
        </Tabs>
    </div>
  );
}
