
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Transaction } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import type { SortDescriptor } from '@/hooks/use-sortable-data';

type TransactionTableProps = {
    title: string;
    description: string;
    transactions: Transaction[];
    sortDescriptor: SortDescriptor | null;
    onSortChange: (descriptor: SortDescriptor) => void;
};

export function TransactionTable({ title, description, transactions, sortDescriptor, onSortChange }: TransactionTableProps) {
  const formatItems = (items: Transaction['items']) => {
    if (!items || items.length === 0) return 'N/A';
    if (items.length === 1) return `${items[0].quantity}x ${items[0].productName}`;
    return `${items.length} itens`;
  };

  const isAdjustment = transactions[0]?.type === 'Descarte';

  const handleSort = (key: string) => {
    const direction = sortDescriptor?.key === key && sortDescriptor.direction === 'ascending' ? 'descending' : 'ascending';
    onSortChange({ key, direction });
  };

  const getSortIndicator = (key: string) => {
    if (sortDescriptor?.key !== key) return null;
    return sortDescriptor.direction === 'ascending' ? '▲' : '▼';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                   <Button variant="ghost" onClick={() => handleSort('date')}>
                    Data
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                   <Button variant="ghost" onClick={() => handleSort('userName')}>
                    Responsável
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Itens</TableHead>
                {isAdjustment && <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('reason')}>
                        Motivo
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </TableHead>}
                <TableHead className="text-right">
                    <Button variant="ghost" onClick={() => handleSort('total')}>
                        {isAdjustment ? 'Valor do Ajuste' : 'Valor Total'}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 && (
                <TableRow>
                    <TableCell colSpan={isAdjustment ? 5 : 4} className="text-center h-24 text-muted-foreground">
                        Nenhuma transação encontrada.
                    </TableCell>
                </TableRow>
              )}
              {transactions.map((transaction) => {
                const totalIsNegative = transaction.total < 0;
                return (
                    <TableRow key={transaction.id}>
                    <TableCell>
                        {transaction.date && format( (transaction.date as Timestamp).toDate(), "dd/MM/yyyy HH:mm", {
                        locale: ptBR,
                        })}
                    </TableCell>
                    <TableCell>{transaction.userName}</TableCell>
                    <TableCell>{formatItems(transaction.items)}</TableCell>
                    {isAdjustment && <TableCell>{transaction.reason}</TableCell>}
                    <TableCell className={cn("text-right font-medium", totalIsNegative ? 'text-destructive' : 'text-primary')}>
                        {totalIsNegative ? '-' : ''} R$ {Math.abs(transaction.total).toFixed(2).replace('.', ',')}
                    </TableCell>
                    </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
