'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';

interface LoginAdminProps {
    onAuthenticated: () => void;
}

const ADMIN_PASSWORD = '123456';

export function LoginAdmin({ onAuthenticated }: LoginAdminProps) {
    const [password, setPassword] = useState('');
    const [isPending, setIsPending] = useState(false);
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);

        if (password === ADMIN_PASSWORD) {
            toast({
                title: 'Acceso concedido',
                description: 'Bienvenido al panel de administración.',
            });
            onAuthenticated();
        } else {
            toast({
                title: 'Error de acceso',
                description: 'La contraseña es incorrecta.',
                variant: 'destructive',
            });
            setIsPending(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="max-w-sm w-full mx-auto shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-headline">Acceso de Administrador</CardTitle>
                    <CardDescription className="text-center">
                        Introduce la contraseña para acceder al panel.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="admin-password">Contraseña de Administrador</Label>
                            <Input
                                id="admin-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Introduce la contraseña"
                                required
                            />
                        </div>
                        <Button type="submit" disabled={isPending} className="w-full">
                            <Lock className="mr-2 h-4 w-4" />
                            {isPending ? 'Verificando...' : 'Entrar'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
