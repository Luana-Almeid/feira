
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import type { Transaction } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';

type SaleDetailsDialogProps = {
  sale: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SaleDetailsDialog({ sale, open, onOpenChange }: SaleDetailsDialogProps) {
  if (!sale) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes da Venda</DialogTitle>
          <DialogDescription>
            ID: <span className="font-mono text-xs">{sale.id}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
            <div className="text-sm">
                <strong>Data:</strong> {sale.date && format((sale.date as Timestamp).toDate(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </div>
            <div className="rounded-md border">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-center">Qtd.</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {sale.items.map((item, index) => (
                    <TableRow key={index}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">R$ {(item.quantity * item.unitPrice).toFixed(2).replace('.', ',')}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </div>
            <Separator />
            <div className="flex justify-end items-center gap-4 text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">R$ {sale.total.toFixed(2).replace('.', ',')}</span>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
