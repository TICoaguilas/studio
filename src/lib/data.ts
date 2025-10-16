import type { User, TimeRecord } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/lib/data.json');

type Data = {
    users: User[];
    timeRecords: TimeRecord[];
};

const readData = async (): Promise<Data> => {
    try {
        const fileContent = await fs.readFile(dataFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        // If file doesn't exist, create it with initial data
        const initialData: Data = {
            users: [
                { id: '1', name: 'ANA ROSA', isClockedIn: false, password: '2425' },
                { id: '2', name: 'ANTONIO', isClockedIn: false, password: '1' },
                { id: '3', name: 'MANOLO', isClockedIn: false, password: '1' },
                { id: '4', name: 'JUANITO', isClockedIn: false, password: '1' },
                { id: '5', name: 'PEPITO', isClockedIn: false, password: '1' },
            ],
            timeRecords: []
        };
        await writeData(initialData);
        return initialData;
    }
};

const writeData = async (data: Data): Promise<void> => {
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

export const getUsers = async (): Promise<User[]> => {
    const data = await readData();
    return data.users;
};

export const getUserById = async (id: string): Promise<User | undefined> => {
    const data = await readData();
    return data.users.find(u => u.id === id);
};

export const getTimeRecords = async (): Promise<TimeRecord[]> => {
    const data = await readData();
    return data.timeRecords.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const addTimeRecord = async (userId: string, type: 'in' | 'out', ipAddress: string): Promise<TimeRecord> => {
    const data = await readData();
    const user = data.users.find(u => u.id === userId);

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

    data.timeRecords.push(newRecord);

    const userIndex = data.users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        data.users[userIndex].isClockedIn = type === 'in';
        if (type === 'in') {
            data.users[userIndex].lastClockIn = newRecord.timestamp;
        }
    }

    await writeData(data);
    return newRecord;
};
