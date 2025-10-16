import type { User, TimeRecord } from '@/lib/types';

// In-memory store
const users: User[] = [
    { id: '1', name: 'ANA ROSA', isClockedIn: false },
    { id: '2', name: 'ANTONIO', isClockedIn: false },
    { id: '3', name: 'MANOLO', isClockedIn: false },
    { id: '4', name: 'JUANITO', isClockedIn: false },
    { id: '5', name: 'PEPITO', isClockedIn: false },
];

const timeRecords: TimeRecord[] = [];

// Data access functions
export const getUsers = async (): Promise<User[]> => {
    // Simulate async operation
    return Promise.resolve(JSON.parse(JSON.stringify(users)));
};

export const getUserById = async (id: string): Promise<User | undefined> => {
    const user = users.find(u => u.id === id);
    return Promise.resolve(user ? JSON.parse(JSON.stringify(user)) : undefined);
};

export const getTimeRecords = async (): Promise<TimeRecord[]> => {
    const sortedRecords = [...timeRecords].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return Promise.resolve(JSON.parse(JSON.stringify(sortedRecords)));
};

export const addTimeRecord = async (userId: string, type: 'in' | 'out', ipAddress: string): Promise<TimeRecord> => {
    const user = await getUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const newRecord: TimeRecord = {
        id: crypto.randomUUID(),
        userId,
        userName: user.name,
        type,
        timestamp: new Date().toISOString(),
        ipAddress,
    };

    timeRecords.push(newRecord);

    // Update user status
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex].isClockedIn = type === 'in';
        if (type === 'in') {
            users[userIndex].lastClockIn = newRecord.timestamp;
        }
    }

    return Promise.resolve(JSON.parse(JSON.stringify(newRecord)));
};
