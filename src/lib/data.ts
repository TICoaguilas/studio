import type { User, TimeRecord } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

// This is a server-side only module.

const dataFilePath = path.join(process.cwd(), 'src', 'lib', 'data.json');

type Data = {
    users: User[];
    timeRecords: TimeRecord[];
};

let dataCache: Data | null = null;

const readData = async (): Promise<Data> => {
    // In development, always read from file to reflect changes.
    // In production, cache the data.
    if (dataCache && process.env.NODE_ENV !== 'development') {
        return dataCache;
    }

    try {
        const fileContent = await fs.readFile(dataFilePath, 'utf-8');
        const data = JSON.parse(fileContent);
        dataCache = data;
        return data;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
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
            dataCache = initialData;
            return initialData;
        }
        console.error("Error reading data file:", error);
        // In case of other errors, return a default empty state to avoid crashing
        return { users: [], timeRecords: [] };
    }
};

const writeData = async (data: Data): Promise<void> => {
    try {
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
        dataCache = data; // Update cache after writing
    } catch (error) {
        console.error("Error writing data file:", error);
    }
};

export const getUsers = async (): Promise<User[]> => {
    const data = await readData();
    // Return a deep copy to prevent mutation of the cache
    return JSON.parse(JSON.stringify(data.users));
};

export const getUserById = async (id: string): Promise<User | undefined> => {
    const data = await readData();
    const user = data.users.find(u => u.id === id);
    return user ? JSON.parse(JSON.stringify(user)) : undefined;
};

export const getUserByName = async (name: string): Promise<User | undefined> => {
    const data = await readData();
    const user = data.users.find(u => u.name === name);
    return user ? JSON.parse(JSON.stringify(user)) : undefined;
};


export const getTimeRecords = async (): Promise<TimeRecord[]> => {
    const data = await readData();
    const records = data.timeRecords.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return JSON.parse(JSON.stringify(records));
};

export const addTimeRecord = async (userId: string, type: 'in' | 'out', timestamp: Date, ipAddress: string): Promise<TimeRecord> => {
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
        timestamp: timestamp.toISOString(),
        ipAddress,
    };

    const newData = JSON.parse(JSON.stringify(data));
    newData.timeRecords.push(newRecord);

    const userIndex = newData.users.findIndex((u:User) => u.id === userId);
    if (userIndex !== -1) {
        newData.users[userIndex].isClockedIn = type === 'in';
        if (type === 'in') {
            newData.users[userIndex].lastClockIn = newRecord.timestamp;
        }
    }

    await writeData(newData);
    return newRecord;
};