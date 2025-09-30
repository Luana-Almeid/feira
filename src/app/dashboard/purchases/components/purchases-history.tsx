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
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { useData } from '@/contexts/data-context';

export function PurchasesHistory() {
  const { transactions } = useData();
  const purchases = transactions.filter((t) => t.type === 'Compra');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
              {purchases.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        Nenhuma compra registrada.
                    </TableCell>
                </TableRow>
              )}
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="hidden sm:table-cell font-mono text-xs font-medium">
                    {purchase.id}
                  </TableCell>
                  <TableCell>
                    {isClient ? format(new Date(purchase.date), "dd/MM/yyyy 'às' HH:mm", {
                      locale: ptBR,
                    }) : ''}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      {purchase.items.map((item) => (
                        <span key={item.product.id} className="text-sm">
                          {item.quantity} {item.product.unit} de {item.product.name}
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
