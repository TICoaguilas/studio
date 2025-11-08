'use client';

import { useState, useTransition, useEffect } from 'react';
import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogIn, LogOut, User as UserIcon, CheckCircle, XCircle, MapPin } from 'lucide-react';
import { handleClockEvent } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { Label } from './ui/label';

export function ClockStation({ users, onClockSuccess }: { users: User[], onClockSuccess: () => void }) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
    const [password, setPassword] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | undefined>();

    useEffect(() => {
        setSelectedUser(users.find(u => u.id === selectedUserId));
    }, [selectedUserId, users]);

    const onClockSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedUserId) {
            toast({
                title: 'Error',
                description: 'Por favor, selecciona un usuario.',
                variant: 'destructive',
            });
            return;
        }

        if (!navigator.geolocation) {
             toast({
                title: 'Error de geolocalización',
                description: 'La geolocalización no es compatible con tu navegador.',
                variant: 'destructive',
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                startClockTransition({ latitude, longitude });
            },
            (error) => {
                console.error("Geolocation error:", error);
                toast({
                    title: 'Error de ubicación',
                    description: 'No se pudo obtener tu ubicación. Por favor, activa los permisos de ubicación para tu navegador.',
                    variant: 'destructive',
                });
                // Optional: allow clocking in without location
                // startClockTransition(); 
            }
        );
    };

    const startClockTransition = (location?: { latitude: number; longitude: number }) => {
        if (!selectedUserId) return;

        startTransition(async () => {
            const result = await handleClockEvent(selectedUserId, password, location);
            if (result?.error) {
                toast({
                    title: 'Error',
                    description: result.error,
                    variant: 'destructive',
                });
            } else if (result?.success) {
                toast({
                    title: 'Éxito',
                    description: result.message,
                });
                onClockSuccess();
                // Reset form
                setSelectedUserId(undefined);
                setPassword('');
            }
        });
    }

    return (
        <Card className="max-w-md mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="text-center text-2xl font-headline">Registrar Movimiento</CardTitle>
                <CardDescription className="text-center">
                    Selecciona tu nombre e introduce tu contraseña para fichar. Se requerirá tu ubicación.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onClockSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="user-select">Usuario</Label>
                        <Select onValueChange={setSelectedUserId} value={selectedUserId}>
                            <SelectTrigger id="user-select" className="w-full">
                                <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                <SelectValue placeholder="Selecciona tu nombre" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                        <div className="flex items-center justify-between w-full">
                                            <span>{user.name}</span>
                                            {user.isClockedIn ? (
                                                <span className="flex items-center text-xs text-green-600">
                                                    <CheckCircle className="mr-1 h-3 w-3" />
                                                    Registrado
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-xs text-muted-foreground">
                                                    <XCircle className="mr-1 h-3 w-3" />
                                                    No Registrado
                                                </span>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password-input">Contraseña</Label>
                        <Input
                            id="password-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Introduce tu contraseña"
                            required
                            disabled={!selectedUserId}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending || !selectedUserId}
                        className="w-full"
                        variant={selectedUser?.isClockedIn ? 'destructive' : 'default'}
                    >
                        {isPending ? (
                            <Skeleton className="h-4 w-20" />
                        ) : selectedUser ? (
                            selectedUser.isClockedIn ? (
                                <>
                                    <LogOut className="mr-2 h-4 w-4" /> Registrar Salida
                                </>
                            ) : (
                                <>
                                    <LogIn className="mr-2 h-4 w-4" /> Registrar Entrada
                                </>
                            )
                        ) : (
                            'Selecciona un usuario'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
