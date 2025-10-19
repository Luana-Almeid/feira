
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
import { Badge } from '@/components/ui/badge';
import { useCollection } from '@/hooks/use-collection';
import { collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { type UserProfile } from '@/lib/types';
import { EmployeeActions } from './employee-actions';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useMemo } from 'react';

export function EmployeeList() {
  const employeesQuery = useMemo(() => 
    query(collection(db, 'users'), orderBy('name'))
  , []);
  
  const { data: employees, loading } = useCollection<UserProfile>(employeesQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Funcionários</CardTitle>
        <CardDescription>
          Todos os funcionários cadastrados no sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Demissão</TableHead>
                <TableHead className="w-[60px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary"/>
                    </TableCell>
                </TableRow>
              )}
              {!loading && employees.length === 0 && (
                <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                        Nenhum funcionário cadastrado.
                    </TableCell>
                </TableRow>
              )}
              {employees.map((employee) => (
                <TableRow key={employee.uid}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.cpf}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <Badge variant={employee.role === 'administrador' ? 'default' : 'secondary'}>
                      {employee.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={employee.status === 'ativo' ? 'secondary' : 'destructive'}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {employee.dismissalDate ? format(new Date(employee.dismissalDate), 'dd/MM/yyyy', { locale: ptBR }) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <EmployeeActions employee={employee} />
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
