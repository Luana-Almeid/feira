'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartTooltipContent,
  ChartContainer,
} from '@/components/ui/chart';
import { useState, useEffect } from 'react';


const initialChartData = [
  { date: 'Seg', sales: 0 },
  { date: 'Ter', sales: 0 },
  { date: 'Qua', sales: 0 },
  { date: 'Qui', sales: 0 },
  { date: 'Sex', sales: 0 },
  { date: 'Sáb', sales: 0 },
  { date: 'Dom', sales: 0 },
];

const generateChartData = () => [
  { date: 'Seg', sales: Math.floor(Math.random() * 200) + 100 },
  { date: 'Ter', sales: Math.floor(Math.random() * 200) + 100 },
  { date: 'Qua', sales: Math.floor(Math.random() * 200) + 100 },
  { date: 'Qui', sales: Math.floor(Math.random() * 200) + 100 },
  { date: 'Sex', sales: Math.floor(Math.random() * 200) + 100 },
  { date: 'Sáb', sales: Math.floor(Math.random() * 200) + 100 },
  { date: 'Dom', sales: Math.floor(Math.random() * 200) + 100 },
];


export function SalesChart() {
  const [chartData, setChartData] = useState(initialChartData);

  useEffect(() => {
    setChartData(generateChartData());
  }, []);

  return (
    <Card>
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
          className="h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: -10 }}>
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--accent) / 0.1)' }}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
