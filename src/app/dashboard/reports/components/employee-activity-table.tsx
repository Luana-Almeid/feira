
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

type EmployeeActivityTableProps = {
    users: UserProfile[];
};

export function EmployeeActivityTable({ users }: EmployeeActivityTableProps) {
    const formatDate = (date: string | Date | Timestamp | null | undefined) => {
        if (!date) return 'N/A';
        if (date instanceof Timestamp) {
        return format(date.toDate(), 'dd/MM/yyyy', { locale: ptBR });
        }
        return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
    }

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
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Admissão</TableHead>
                <TableHead>Data de Demissão</TableHead>
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
