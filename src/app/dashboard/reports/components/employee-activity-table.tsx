
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
import type { UserProfile } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import type { SortDescriptor } from '@/hooks/use-sortable-data';

type EmployeeActivityTableProps = {
    users: UserProfile[];
    sortDescriptor: SortDescriptor | null;
    onSortChange: (descriptor: SortDescriptor) => void;
};

export function EmployeeActivityTable({ users, sortDescriptor, onSortChange }: EmployeeActivityTableProps) {
    const formatDate = (date: string | Date | Timestamp | null | undefined) => {
        if (!date) return 'N/A';
        if (date instanceof Timestamp) {
        return format(date.toDate(), 'dd/MM/yyyy', { locale: ptBR });
        }
        return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
    }

    const handleSort = (key: string) => {
      const direction = sortDescriptor?.key === key && sortDescriptor.direction === 'ascending' ? 'descending' : 'ascending';
      onSortChange({ key, direction });
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade dos Funcionários</CardTitle>
        <CardDescription>
          Controle de admissões e demissões da equipe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('name')} className="px-0">
                    Nome
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('email')} className="px-0">
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('role')} className="px-0">
                    Perfil
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('status')} className="px-0">
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('admissionDate')} className="px-0">
                    Data de Admissão
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                   <Button variant="ghost" onClick={() => handleSort('dismissalDate')} className="px-0">
                    Data de Demissão
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
               {users.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                        Nenhum funcionário encontrado.
                    </TableCell>
                </TableRow>
              )}
              {users.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'administrador' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                   <TableCell>
                    <Badge variant={user.status === 'ativo' ? 'secondary' : 'destructive'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.admissionDate)}</TableCell>
                  <TableCell>{formatDate(user.dismissalDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
