
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type HighlightCardProps = {
  title: string;
  icon: LucideIcon;
  productName: string;
  quantity: number;
  unit: string;
};

export function HighlightCard({ title, icon: Icon, productName, quantity, unit }: HighlightCardProps) {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {productName === 'N/A' || quantity === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma venda registrada no período.</p>
        ) : (
          <>
            <div className="text-2xl font-bold truncate">{productName}</div>
            <p className="text-xs text-muted-foreground">
              <span className='font-bold'>{quantity}</span> {unit}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
