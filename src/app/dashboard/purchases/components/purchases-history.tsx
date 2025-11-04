
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
import { collection, query, where, orderBy, Timestamp, runTransaction, doc, increment } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { type Transaction } from '@/lib/types';
import { useMemo, useState } from 'react';
import { PurchaseDetailsDialog } from './purchase-details-dialog';
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

export function PurchasesHistory() {
  const [selectedPurchase, setSelectedPurchase] = useState<Transaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
  const { toast } = useToast();
  
  const purchasesQuery = useMemo(() => 
    query(collection(db, 'transactions'), where('type', '==', 'Compra'), orderBy('date', 'desc'))
  , []);
  
  const { data: purchases, loading } = useCollection<Transaction>(purchasesQuery);

  const handleOpenDetails = (purchase: Transaction) => {
    setSelectedPurchase(purchase);
    setIsDetailsOpen(true);
  }

  const handleOpenCancelAlert = (purchase: Transaction) => {
    setSelectedPurchase(purchase);
    setIsCancelAlertOpen(true);
  };

  const handleCancelPurchase = async () => {
    if (!selectedPurchase) return;

    try {
      await runTransaction(db, async (transaction) => {
        // 1. Delete the purchase transaction
        const purchaseRef = doc(db, 'transactions', selectedPurchase.id);
        transaction.delete(purchaseRef);

        // 2. Decrement stock for each product in the purchase
        for (const item of selectedPurchase.items) {
          const productRef = doc(db, 'products', item.productId);
          transaction.update(productRef, { stock: increment(-item.quantity) });
        }
      });

      toast({
        title: "Compra Cancelada",
        description: "A compra foi cancelada e o estoque foi restaurado.",
      });
      
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Erro ao cancelar compra",
        description: "Não foi possível completar a operação.",
      });
      console.error(error);
    } finally {
      setIsCancelAlertOpen(false);
      setSelectedPurchase(null);
    }
  };


  return (
    <>
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
                          {item.quantity}x {item.productName}
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
                        <DropdownMenuItem onSelect={() => handleOpenDetails(purchase)}>Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onSelect={() => handleOpenCancelAlert(purchase)}>
                          <Ban className='mr-2 h-4 w-4'/>
                          Cancelar Compra
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

     <PurchaseDetailsDialog
        purchase={selectedPurchase}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
    />

    <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. A compra será cancelada e o estoque dos produtos será revertido.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancelPurchase} className="bg-destructive hover:bg-destructive/90">
            Sim, cancelar compra
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
