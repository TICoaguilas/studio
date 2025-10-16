'use client';

import type { User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User as UserIcon, CheckCircle, XCircle } from 'lucide-react';
import { handleClockEvent } from '@/lib/actions';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from './ui/skeleton';

export function ClockStation({ users }: { users: User[] }) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const onClockClick = (userId: string) => {
        startTransition(async () => {
            const result = await handleClockEvent(userId);
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
            }
        });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {users.map((user) => (
                <Card key={user.id} className="flex flex-col text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <CardHeader className="flex-grow">
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                          <UserIcon className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="font-headline text-xl">{user.name}</CardTitle>
                        {user.isClockedIn ? (
                            <Badge variant="outline" className="w-fit mx-auto border-green-500 text-green-700 bg-green-50">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Registrado
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="w-fit mx-auto">
                                <XCircle className="mr-1 h-3 w-3 text-muted-foreground" />
                                No Registrado
                            </Badge>
                        )}
                        <CardDescription className="pt-2">
                            {user.isClockedIn && user.lastClockIn ? (
                                `Desde ${formatDistanceToNow(new Date(user.lastClockIn), { addSuffix: true })}`
                            ) : (
                                'Listo para empezar el día'
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-end">
                        <Button
                            onClick={() => onClockClick(user.id)}
                            disabled={isPending}
                            variant={user.isClockedIn ? 'destructive' : 'default'}
                            className={`w-full ${!user.isClockedIn ? 'bg-accent hover:bg-accent/90' : ''}`}
                        >
                            {isPending ? (
                                <Skeleton className="h-4 w-20" />
                             ) : user.isClockedIn ? (
                                <>
                                    <LogOut className="mr-2 h-4 w-4" /> Salir
                                </>
                            ) : (
                                <>
                                    <LogIn className="mr-2 h-4 w-4" /> Entrar
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
