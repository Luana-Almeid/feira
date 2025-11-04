
'use client';

import { useMemo, useState } from 'react';
import { useCollection } from '@/hooks/use-collection';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { type Transaction, type UserProfile } from '@/lib/types';
import { Loader2, Search, FileDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionTable } from './transaction-table';
import { EmployeeActivityTable } from './employee-activity-table';
import { Input } from '@/components/ui/input';
import { useSortableData, type SortDescriptor } from '@/hooks/use-sortable-data';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ActivityChart } from './activity-chart';

const searchKeysMap = {
  sales: ['userName', 'items.productName', 'total'],
  purchases: ['userName', 'items.productName', 'total'],
  adjustments: ['userName', 'items.productName', 'reason', 'total'],
  employees: ['name', 'email', 'cpf', 'role', 'status']
};

const TabContent = ({ 
  data, 
  type, 
  searchTerm, 
}: { 
  data: any[], 
  type: keyof typeof searchKeysMap, 
  searchTerm: string, 
}) => {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor | null>(null);
  
  const searchKeys = searchKeysMap[type];
  const { sortedData } = useSortableData(data, sortDescriptor, searchTerm, searchKeys);
  
  const renderTable = () => {
    switch(type) {
      case 'sales':
        return <TransactionTable title="Histórico de Vendas" description="Todas as vendas registradas." transactions={sortedData as Transaction[]} sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor} />;
      case 'purchases':
        return <TransactionTable title="Histórico de Compras" description="Todas as compras de fornecedores." transactions={sortedData as Transaction[]} sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor} />;
      case 'adjustments':
        return <TransactionTable title="Histórico de Ajustes e Descartes" description="Entradas e saídas manuais do estoque." transactions={sortedData as Transaction[]} sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor} />;
      case 'employees':
        return <EmployeeActivityTable users={sortedData as UserProfile[]} sortDescriptor={sortDescriptor} onSortChange={setSortDescriptor} />;
      default:
        return null;
    }
  }

  return (
    <div className='space-y-4'>
      {renderTable()}
      <ActivityChart data={sortedData} type={type} />
    </div>
  )
}

export function ReportsClient() {
  const [activeTab, setActiveTab] = useState('sales');
  const [searchTerm, setSearchTerm] = useState('');

  const transactionsQuery = useMemo(() => query(collection(db, 'transactions'), orderBy('date', 'desc')), []);
  const usersQuery = useMemo(() => query(collection(db, 'users'), orderBy('name')), []);

  const { data: transactions, loading: transactionsLoading } = useCollection<Transaction>(transactionsQuery);
  const { data: users, loading: usersLoading } = useCollection<UserProfile>(usersQuery);

  const loading = transactionsLoading || usersLoading;

  const sales = useMemo(() => transactions.filter(t => t.type === 'Venda'), [transactions]);
  const purchases = useMemo(() => transactions.filter(t => t.type === 'Compra'), [transactions]);
  const adjustments = useMemo(() => transactions.filter(t => t.type === 'Descarte'), [transactions]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchTerm('');
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
  
  const formatDateForExport = (dateValue: string | Date | Timestamp | null | undefined): string => {
    if (!dateValue) return 'N/A';
    let date;
    if (dateValue instanceof Timestamp) {
      date = dateValue.toDate();
    } else {
      date = new Date(dateValue);
    }
    if (isNaN(date.getTime())) {
        return 'Data inválida'
    }
    return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  }

  const handleExportCSV = () => {
    if (!currentData.length) return;

    let headers: string[] = [];
    let data: any[][] = [];
    const fileName = `${activeTab}_report_${new Date().toISOString().split('T')[0]}.csv`;

    if (activeTab === 'employees') {
        headers = ['Nome', 'Email', 'CPF', 'Perfil', 'Status', 'Data de Admissão', 'Data de Demissão'];
        data = (currentData as UserProfile[]).map(user => [
            user.name,
            user.email,
            user.cpf,
            user.role,
            user.status,
            formatDateForExport(user.admissionDate),
            user.dismissalDate ? formatDateForExport(user.dismissalDate) : 'N/A'
        ]);
    } else {
        const isAdjustment = activeTab === 'adjustments';
        headers = ['Data', 'Responsável', 'Itens', ...(isAdjustment ? ['Motivo'] : []), isAdjustment ? 'Valor do Ajuste' : 'Valor Total'];
        data = (currentData as Transaction[]).map(tx => [
            formatDateForExport(tx.date),
            tx.userName,
            tx.items.map(i => `${i.quantity}x ${i.productName}`).join('; '),
            ...(isAdjustment ? [tx.reason || ''] : []),
            tx.total.toFixed(2).replace('.', ',')
        ]);
    }
    
    const csvContent = [
        headers.join(','),
        ...data.map(row => row.map(field => `"${String(field || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
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
            <div className="flex justify-between items-center mb-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="sales">Vendas</TabsTrigger>
                    <TabsTrigger value="purchases">Compras</TabsTrigger>
                    <TabsTrigger value="adjustments">Ajustes</TabsTrigger>
                    <TabsTrigger value="employees">Funcionários</TabsTrigger>
                </TabsList>
                 <Button variant="outline" onClick={handleExportCSV} disabled={currentData.length === 0}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Exportar
                </Button>
            </div>


            <div className="relative my-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Buscar em todos os campos..." 
                    className="pl-10 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <TabsContent value="sales" key="sales">
                <TabContent data={sales} type="sales" searchTerm={searchTerm} />
            </TabsContent>
            <TabsContent value="purchases" key="purchases">
                <TabContent data={purchases} type="purchases" searchTerm={searchTerm} />
            </TabsContent>
            <TabsContent value="adjustments" key="adjustments">
                <TabContent data={adjustments} type="adjustments" searchTerm={searchTerm} />
            </TabsContent>
            <TabsContent value="employees" key="employees">
                <TabContent data={users} type="employees" searchTerm={searchTerm} />
            </TabsContent>
        </Tabs>
    </div>
  );
}
