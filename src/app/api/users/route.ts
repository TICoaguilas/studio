import { getUsers } from '@/lib/data';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const users = await getUsers();
        return NextResponse.json(users);
    } catch (error) {
        console.error('API Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
