'use client';

import { useState } from 'react';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getRecommendationsAction, type RecommendationResult } from '../actions';
import { useData } from '@/contexts/data-context';

export function RecommendationsClient() {
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { products, transactions } = useData();

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setRecommendations(null);

    // Prepare data for the AI model
    const salesData = transactions
      .filter(t => t.type === 'Venda')
      .flatMap(t => t.items.map(item => ({ name: item.product.name, quantity: item.quantity, date: t.date })));
      
    const currentInventory = products.map(p => ({ name: p.name, stock: p.stock }));
    
    const result = await getRecommendationsAction(
      JSON.stringify(salesData),
      JSON.stringify(currentInventory)
    );
    
    setRecommendations(result);
    setIsLoading(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recomendações de Compra Inteligente</CardTitle>
        <CardDescription>
          Use a IA para obter sugestões de quantidades de compra com base nos dados de vendas e estoque.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <Button onClick={handleGetRecommendations} disabled={isLoading} size="lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Lightbulb className="mr-2 h-4 w-4" />
              Gerar Recomendações de Compra
            </>
          )}
        </Button>
        
        {recommendations && 'error' in recommendations && (
          <Alert variant="destructive" className="w-full">
            <AlertTitle>Erro ao Gerar Recomendações</AlertTitle>
            <AlertDescription>{recommendations.error}</AlertDescription>
          </Alert>
        )}

        {recommendations && !('error' in recommendations) && Object.keys(recommendations).length > 0 && (
          <div className="w-full rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Quantidade Recomendada para Compra</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(recommendations).map(([productName, quantity]) => (
                  <TableRow key={productName}>
                    <TableCell className="font-medium">{productName}</TableCell>
                    <TableCell className="text-right font-bold text-primary">{quantity} unidades</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
