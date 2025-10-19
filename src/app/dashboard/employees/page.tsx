
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { EmployeeList } from './components/employee-list';

export default function EmployeesPage() {
    return (
        <>
            <PageHeader
                title="Gerenciar Funcionários"
                description="Adicione, edite e gerencie os perfis dos seus funcionários."
            >
                <Link href="/dashboard/employees/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Cadastrar Funcionário
                    </Button>
                </Link>
            </PageHeader>
            <EmployeeList />
        </>
    )
}
