
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
import { Loader2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCollection } from '@/hooks/use-collection';
import { collection, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { type Transaction } from '@/lib/types';

export function PurchasesHistory() {
  const { data: purchases, loading } = useCollection<Transaction>(
    query(collection(db, 'transactions'), where('type', '==', 'Compra'), orderBy('date', 'desc'))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Compras</CardTitle>
        <CardDescription>
          Acompanhe todas as suas aquisições de produtos de fornecedores.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell w-[120px]">ID da Compra</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead className="text-right">Custo Total</TableHead>
                <TableHead className="w-[60px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary"/>
                    </TableCell>
                </TableRow>
              )}
              {!loading && purchases.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        Nenhuma compra registrada.
                    </TableCell>
                </TableRow>
              )}
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="hidden sm:table-cell font-mono text-xs font-medium">
                    {purchase.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    {purchase.date && format( (purchase.date as Timestamp).toDate(), "dd/MM/yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      {purchase.items.map((item, index) => (
                        <span key={index} className="text-sm">
                          {item.quantity} {item.productName}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {purchase.total.toFixed(2).replace('.', ',')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Ações</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem disabled>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem disabled>Editar Compra</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
