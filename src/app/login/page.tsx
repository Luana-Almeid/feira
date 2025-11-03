
import { LoginForm } from "./components/login-form";
import { Leaf } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="mx-auto flex w-full max-w-[350px] flex-col justify-center space-y-6">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary mb-4">
                        <Leaf className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Bem-vindo(a) de volta!
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Digite seu e-mail e senha para acessar o painel.
                    </p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
