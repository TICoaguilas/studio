'use server';

import { addTimeRecord, getUserById, getUserByName } from '@/lib/data';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function handleClockEvent(userId: string, password?: string, location?: { latitude: number; longitude: number }) {
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
        
        await addTimeRecord(userId, eventType, new Date(), ip, location?.latitude, location?.longitude);

        revalidatePath('/');
        revalidatePath('/admin');
        
        const eventTypeSpanish = eventType === 'in' ? 'entrada' : 'salida';
        return { success: true, message: `¡Se ha registrado la ${eventTypeSpanish} de ${user.name} correctamente!` };
    } catch (error) {
        console.error(error);
        return { error: 'Ocurrió un error inesperado.' };
    }
}

export async function handleManualClockEvent(userName: string, type: 'in' | 'out', timestamp: Date) {
    try {
        const user = await getUserByName(userName);
        if (!user) {
            return { error: 'Usuario no encontrado' };
        }

        const ip = headers().get('x-forwarded-for') ?? headers().get('remote_addr') ?? '127.0.0.1';
        
        await addTimeRecord(user.id, type, timestamp, ip);

        revalidatePath('/');
        revalidatePath('/admin');
        
        const eventTypeSpanish = type === 'in' ? 'entrada' : 'salida';
        return { success: true, message: `¡Registro manual de ${eventTypeSpanish} para ${user.name} añadido correctamente!` };
    } catch (error) {
        console.error(error);
        return { error: 'Ocurrió un error inesperado durante el registro manual.' };
    }
}
