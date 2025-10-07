
import { PageHeader } from '@/components/page-header';
import { NewEmployeeForm } from '../components/new-employee-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function NewEmployeePage() {
  return (
    <>
      <PageHeader
        title="Cadastrar Novo Funcionário"
        description="Preencha os dados para criar um novo acesso."
      />
      <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Dados do Funcionário</CardTitle>
            <CardDescription>
              Após o cadastro, o funcionário poderá acessar o sistema com o e-mail e senha definidos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewEmployeeForm />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
