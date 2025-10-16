'use server';

import { addTimeRecord, getUserById } from '@/lib/data';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function handleClockEvent(userId: string) {
    try {
        const user = await getUserById(userId);
        if (!user) {
            return { error: 'User not found' };
        }

        const ip = headers().get('x-forwarded-for') ?? headers().get('remote_addr') ?? '127.0.0.1';
        const eventType = user.isClockedIn ? 'out' : 'in';
        
        await addTimeRecord(userId, eventType, ip);

        revalidatePath('/');
        revalidatePath('/admin');
        
        return { success: true, message: `Successfully clocked ${eventType}!` };
    } catch (error) {
        console.error(error);
        return { error: 'An unexpected error occurred.' };
    }
}
