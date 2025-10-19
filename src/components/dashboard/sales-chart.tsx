
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartTooltipContent,
  ChartContainer,
} from '@/components/ui/chart';
import { useMemo } from 'react';
import { type Transaction } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';
import { format, subDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type SalesChartProps = {
  sales: Transaction[];
};

export function SalesChart({ sales }: SalesChartProps) {
  const chartData = useMemo(() => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    // Initialize sales data for the last 7 days
    const salesByDay = Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(startOfDay(new Date()), 6 - i);
      return {
        date: format(date, 'EEE', { locale: ptBR }),
        fullDate: date,
        sales: 0,
      };
    });

    // Aggregate sales data
    sales.forEach(sale => {
      const saleDate = (sale.date as Timestamp).toDate();
      const matchingDay = salesByDay.find(day => 
        day.fullDate.getDate() === saleDate.getDate() &&
        day.fullDate.getMonth() === saleDate.getMonth() &&
        day.fullDate.getFullYear() === saleDate.getFullYear()
      );
      if (matchingDay) {
        matchingDay.sales += sale.total;
      }
    });

    return salesByDay;
  }, [sales]);

  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Vendas da Semana</CardTitle>
        <CardDescription>Análise dos resultados de vendas dos últimos 7 dias.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            sales: {
              label: 'Vendas',
              color: 'hsl(var(--primary))',
            },
          }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--accent) / 0.1)' }}
                content={<ChartTooltipContent 
                    indicator="dot"
                    formatter={(value, name) => {
                        const formattedValue = typeof value === 'number'
                          ? `R$ ${value.toFixed(2).replace('.', ',')}`
                          : value;
                        return (
                          <div className='flex flex-col'>
                            <span>{name}</span>
                            <span className='font-bold'>{formattedValue}</span>
                          </div>
                        )
                    }}
                />}
              />
              <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Vendas"/>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
