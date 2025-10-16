'use server';

import { addTimeRecord, getUserById } from '@/lib/data';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function handleClockEvent(userId: string, password?: string) {
    try {
        const user = await getUserById(userId);
        if (!user) {
            return { error: 'Usuario no encontrado' };
        }

        if (user.password !== password) {
            return { error: 'Contraseña incorrecta' };
        }

        const ip = headers().get('x-forwarded-for') ?? headers().get('remote_addr') ?? '127.0.0.1';
        const eventType = user.isClockedIn ? 'out' : 'in';
        
        await addTimeRecord(userId, eventType, ip);

        revalidatePath('/');
        revalidatePath('/admin');
        
        const eventTypeSpanish = eventType === 'in' ? 'entrada' : 'salida';
        return { success: true, message: `¡Se ha registrado la ${eventTypeSpanish} de ${user.name} correctamente!` };
    } catch (error) {
        console.error(error);
        return { error: 'Ocurrió un error inesperado.' };
    }
}
