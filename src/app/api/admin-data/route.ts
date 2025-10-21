
import { getTimeRecords, getUsers } from '@/lib/data';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const [records, users] = await Promise.all([
            getTimeRecords(),
            getUsers()
        ]);
        return NextResponse.json({ records, users });
    } catch (error) {
        console.error('API Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
