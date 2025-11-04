
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
import { Loader2, MoreVertical, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCollection } from '@/hooks/use-collection';
import { collection, query, where, orderBy, Timestamp, doc, runTransaction, increment } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { type Transaction } from '@/lib/types';
import { useMemo, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { SaleDetailsDialog } from './sale-details-dialog';


export function SalesHistory() {
  const [selectedSale, setSelectedSale] = useState<Transaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
  const { toast } = useToast();

  const salesQuery = useMemo(() => 
    query(collection(db, 'transactions'), where('type', '==', 'Venda'), orderBy('date', 'desc'))
  , []);
  
  const { data: sales, loading } = useCollection<Transaction>(salesQuery);

  const handleOpenDetails = (sale: Transaction) => {
    setSelectedSale(sale);
    setIsDetailsOpen(true);
  }

  const handleOpenCancelAlert = (sale: Transaction) => {
    setSelectedSale(sale);
    setIsCancelAlertOpen(true);
  };

  const handleCancelSale = async () => {
    if (!selectedSale) return;

    try {
      await runTransaction(db, async (transaction) => {
        // 1. Delete the sale transaction
        const saleRef = doc(db, 'transactions', selectedSale.id);
        transaction.delete(saleRef);

        // 2. Restore stock for each product in the sale
        for (const item of selectedSale.items) {
          const productRef = doc(db, 'products', item.productId);
          transaction.update(productRef, { stock: increment(item.quantity) });
        }
      });

      toast({
        title: "Venda Cancelada",
        description: "A venda foi cancelada e o estoque foi restaurado.",
      });
      
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Erro ao cancelar venda",
        description: "Não foi possível completar a operação.",
      });
      console.error(error);
    } finally {
      setIsCancelAlertOpen(false);
      setSelectedSale(null);
    }
  };


  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Vendas</CardTitle>
        <CardDescription>
          Acompanhe todas as transações de venda realizadas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell w-[120px]">ID da Venda</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[60px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary"/>
                    </TableCell>
                </TableRow>
              )}
              {!loading && sales.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                        Nenhuma venda registrada.
                    </TableCell>
                </TableRow>
              )}
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="hidden sm:table-cell font-mono text-xs font-medium">
                    {sale.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    {sale.date && format( (sale.date as Timestamp).toDate(), "dd/MM/yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell className="font-medium">{sale.userName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {sale.items.length} {sale.items.length > 1 ? 'itens' : 'item'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    R$ {sale.total.toFixed(2).replace('.', ',')}
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
                        <DropdownMenuItem onSelect={() => handleOpenDetails(sale)}>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onSelect={() => handleOpenCancelAlert(sale)}>
                          <Ban className='mr-2 h-4 w-4'/>
                          Cancelar Venda
                        </DropdownMenuItem>
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
    
    <SaleDetailsDialog
        sale={selectedSale}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
    />

    <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. A venda será cancelada e o estoque dos produtos será devolvido.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancelSale} className="bg-destructive hover:bg-destructive/90">
            Sim, cancelar venda
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
