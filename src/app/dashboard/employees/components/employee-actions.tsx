
'use client';

import { MoreVertical, UserCog, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type UserProfile } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from 'react';
import { EditEmployeeDialog } from './edit-employee-dialog';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { useToast } from '@/hooks/use-toast';


type EmployeeActionsProps = {
  employee: UserProfile;
};

export function EmployeeActions({ employee }: EmployeeActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleToggleStatus = async () => {
    const newStatus = employee.status === 'ativo' ? 'inativo' : 'ativo';
    const newDismissalDate = newStatus === 'inativo' ? new Date().toISOString() : null;

    try {
        const employeeRef = doc(db, 'users', employee.uid);
        await updateDoc(employeeRef, {
            status: newStatus,
            dismissalDate: newDismissalDate
        });
        toast({
            title: 'Status alterado!',
            description: `O status de ${employee.name} foi atualizado para ${newStatus}.`
        });
    } catch(error) {
        toast({
            variant: 'destructive',
            title: 'Erro ao alterar status',
            description: 'Não foi possível atualizar o status do funcionário.'
        });
    }
  }

  return (
    <>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-card/80 hover:bg-card">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
              <UserCog className="mr-2 h-4 w-4" />
              Editar Perfil
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className={employee.status === 'ativo' ? 'text-destructive' : ''} onSelect={(e) => e.preventDefault()}>
                <Ban className="mr-2 h-4 w-4" />
                {employee.status === 'ativo' ? 'Demitir' : 'Reativar'}
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
         <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                {employee.status === 'ativo' 
                    ? `Essa ação definirá o funcionário ${employee.name} como "demitido" e registrará a data de hoje como data de demissão.`
                    : `Essa ação reativará o funcionário ${employee.name} no sistema.`
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleToggleStatus} className={employee.status === 'ativo' ? "bg-destructive hover:bg-destructive/90" : ""}>
                Sim, confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
      <EditEmployeeDialog 
        employee={employee}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
}
