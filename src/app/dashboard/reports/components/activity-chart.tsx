
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartTooltipContent,
  ChartContainer,
} from '@/components/ui/chart';
import { useMemo } from 'react';
import { type Transaction, type UserProfile } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';
import { format, subDays, startOfDay, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type ActivityChartProps = {
  data: (Transaction | UserProfile)[];
  type: 'sales' | 'purchases' | 'adjustments' | 'employees';
};

const getChartConfig = (type: ActivityChartProps['type']) => {
    switch (type) {
        case 'sales':
            return { title: 'Vendas (Últimos 30 dias)', description: 'Valor total de vendas por dia.', dataKey: 'value', label: 'Vendas', formatter: (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}` };
        case 'purchases':
            return { title: 'Compras (Últimos 30 dias)', description: 'Custo total de compras por dia.', dataKey: 'value', label: 'Compras', formatter: (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}` };
        case 'adjustments':
            return { title: 'Ajustes (Últimos 30 dias)', description: 'Valor de ajustes (entradas e saídas) por dia.', dataKey: 'value', label: 'Ajustes', formatter: (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}` };
        case 'employees':
            return { title: 'Atividade de Funcionários (Últimos 30 dias)', description: 'Novas admissões e demissões por dia.', dataKey: 'admissions', secondDataKey: 'dismissals', label: 'Admissões', secondLabel: 'Demissões', formatter: (val: number) => `${val} funcionários` };
        default:
            return { title: '', description: '', dataKey: '', label: '', formatter: (val: any) => val };
    }
}

const getDate = (item: Transaction | UserProfile): Date | null => {
    if ('date' in item && (item.date instanceof Timestamp || typeof item.date === 'string' || item.date instanceof Date)) {
        return item.date instanceof Timestamp ? item.date.toDate() : new Date(item.date);
    }
    if ('admissionDate' in item && (item.admissionDate instanceof Timestamp || typeof item.admissionDate === 'string' || item.admissionDate instanceof Date)) {
        return item.admissionDate instanceof Timestamp ? item.admissionDate.toDate() : new Date(item.admissionDate);
    }
    return null;
}

export function ActivityChart({ data, type }: ActivityChartProps) {
    const config = getChartConfig(type);

    const chartData = useMemo(() => {
        const endDate = startOfDay(new Date());
        const startDate = subDays(endDate, 29);
        const interval = { start: startDate, end: endDate };

        const dailyData = Array.from({ length: 30 }).map((_, i) => {
            const date = subDays(endDate, 29 - i);
            const base = { date: format(date, 'dd/MM', { locale: ptBR }) };
            if (type === 'employees') {
                return { ...base, admissions: 0, dismissals: 0 };
            }
            return { ...base, value: 0 };
        });

        data.forEach(item => {
             if (type === 'employees') {
                const user = item as UserProfile;
                const admissionDate = user.admissionDate ? (user.admissionDate instanceof Timestamp ? user.admissionDate.toDate() : new Date(user.admissionDate)) : null;
                const dismissalDate = user.dismissalDate ? (user.dismissalDate instanceof Timestamp ? user.dismissalDate.toDate() : new Date(user.dismissalDate)) : null;

                if (admissionDate && isWithinInterval(admissionDate, interval)) {
                    const dayIndex = dailyData.findIndex(d => d.date === format(admissionDate, 'dd/MM', { locale: ptBR }));
                    if (dayIndex !== -1) (dailyData[dayIndex] as any).admissions += 1;
                }
                if (dismissalDate && isWithinInterval(dismissalDate, interval)) {
                    const dayIndex = dailyData.findIndex(d => d.date === format(dismissalDate, 'dd/MM', { locale: ptBR }));
                    if (dayIndex !== -1) (dailyData[dayIndex] as any).dismissals += 1;
                }

            } else {
                const transaction = item as Transaction;
                const transactionDate = transaction.date ? (transaction.date instanceof Timestamp ? transaction.date.toDate() : new Date(transaction.date)) : null;
                
                if (transactionDate && isWithinInterval(transactionDate, interval)) {
                    const dayIndex = dailyData.findIndex(d => d.date === format(transactionDate, 'dd/MM', { locale: ptBR }));
                    if (dayIndex !== -1) (dailyData[dayIndex] as any).value += transaction.total;
                }
            }
        });

        return dailyData;
    }, [data, type]);

    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{config.title}</CardTitle>
                    <CardDescription>{config.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
                        Nenhum dado disponível para exibir o gráfico.
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{config.title}</CardTitle>
                <CardDescription>{config.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        [config.dataKey]: { label: config.label, color: 'hsl(var(--primary))' },
                        ...(config.secondDataKey && { [config.secondDataKey]: { label: config.secondLabel, color: 'hsl(var(--destructive))' } })
                    }}
                    className="h-[300px] w-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                            <XAxis dataKey="date" tickLine={false} axisLine={false} />
                            <YAxis tickLine={false} axisLine={false} tickFormatter={type !== 'employees' ? (value) => `R$${value}` : (value) => `${value}`} />
                            <Tooltip
                                cursor={{ fill: 'hsl(var(--accent) / 0.1)' }}
                                content={<ChartTooltipContent
                                    indicator="dot"
                                    formatter={(value, name) => {
                                        const formattedValue = typeof value === 'number'
                                            ? config.formatter(value)
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
                            <Bar dataKey={config.dataKey} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name={config.label} />
                             {config.secondDataKey && <Bar dataKey={config.secondDataKey} fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name={config.secondLabel} />}
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
