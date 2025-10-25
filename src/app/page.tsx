"use client";

import { useEffect, useState, useCallback } from "react";
import { ClockStation } from '@/components/ClockStation';
import type { User } from '@/lib/types';
import { Skeleton } from "@/components/ui/skeleton";

async function fetchUsers() {
    const res = await fetch('/api/users');
    if (!res.ok) {
        throw new Error('Failed to fetch users');
    }
    return res.json();
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (error) {
        console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary">
          CPG LA MARINA
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Selecciona tu nombre para registrar tu entrada o salida.
        </p>
      </div>
       {loading ? (
          <div className="max-w-md mx-auto space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <ClockStation users={users} onClockSuccess={loadData} />
        )}
    </main>
  );
}