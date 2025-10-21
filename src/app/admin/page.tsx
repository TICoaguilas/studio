'use client';

import { useState, useEffect } from 'react';
import { AdminDashboard } from '@/components/AdminDashboard';
import type { TimeRecord, User } from '@/lib/types';
import { LoginAdmin } from '@/components/LoginAdmin';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

async function fetchAdminData() {
    const res = await fetch('/api/admin-data');
    if (!res.ok) {
        throw new Error('Failed to fetch admin data');
    }
    return res.json();
}


export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [records, setRecords] = useState<TimeRecord[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const { records: loadedRecords, users: loadedUsers } = await fetchAdminData();
                setRecords(loadedRecords);
                setUsers(loadedUsers.map((u:User) => ({...u, name: u.name})));
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        }

        if (isAuthenticated) {
            loadData();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);
    
    if (loading) {
        return (
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <Skeleton className="h-12 w-1/2 mb-4" />
                    <Skeleton className="h-6 w-3/4" />
                </div>
                <Card className="shadow-lg">
                    <CardHeader>
                        <Skeleton className="h-8 w-1/3 mb-2" />
                        <Skeleton className="h-5 w-2/3" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-40 w-full" />
                    </CardContent>
                </Card>
            </main>
        );
    }


    if (!isAuthenticated) {
        return <LoginAdmin onAuthenticated={() => setIsAuthenticated(true)} />;
    }

    const userNames = users.map(u => u.name);

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">Panel de Administración</h1>
                <p className="mt-2 text-lg text-muted-foreground">Ver y exportar registros de tiempo de los empleados.</p>
            </div>
            <AdminDashboard records={records} userNames={userNames} />
        </main>
    );
}
