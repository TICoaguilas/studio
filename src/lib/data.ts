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
    // In development, always read from the file to get the latest data.
    // In production, cache it for performance.
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
        // Fallback to empty data if there's a different error
        return { users: [], timeRecords: [] };
    }
};

const writeData = async (data: Data): Promise<void> => {
    try {
        await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
        // Invalidate cache after writing
        dataCache = null;
    } catch (error) {
        console.error("Error writing data file:", error);
    }
};

// This function calculates the status based on the records. It's the single source of truth.
const updateUserStatus = (user: User, timeRecords: TimeRecord[]): User => {
    const userRecords = timeRecords
        .filter(r => r.userId === user.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const lastRecord = userRecords[0];

    return {
        ...user,
        isClockedIn: lastRecord ? lastRecord.type === 'in' : false,
        lastClockIn: lastRecord ? lastRecord.timestamp : undefined,
    };
};

export const getUsers = async (): Promise<User[]> => {
    const data = await readData();
    // Always return users with their up-to-date status calculated
    const usersWithStatus = data.users.map(user => updateUserStatus(user, data.timeRecords));
    return JSON.parse(JSON.stringify(usersWithStatus));
};

export const getUserById = async (id: string): Promise<User | undefined> => {
    const data = await readData();
    const user = data.users.find(u => u.id === id);
    if (!user) return undefined;
    
    // Calculate status based on ALL current records
    const userWithStatus = updateUserStatus(user, data.timeRecords);
    return JSON.parse(JSON.stringify(userWithStatus));
};

export const getUserByName = async (name: string): Promise<User | undefined> => {
    const data = await readData();
    const user = data.users.find(u => u.name === name);
    if (!user) return undefined;

    const userWithStatus = updateUserStatus(user, data.timeRecords);
    return JSON.parse(JSON.stringify(userWithStatus));
};


export const getTimeRecords = async (): Promise<TimeRecord[]> => {
    const data = await readData();
    const records = data.timeRecords.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return JSON.parse(JSON.stringify(records));
};

export const addTimeRecord = async (
    userId: string, 
    type: 'in' | 'out', 
    timestamp: Date, 
    ipAddress: string,
    latitude?: number,
    longitude?: number
): Promise<TimeRecord> => {
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
        latitude,
        longitude,
    };

    // Use a fresh copy of the data to avoid mutation issues
    const newData: Data = JSON.parse(JSON.stringify(data));
    newData.timeRecords.push(newRecord);

    // The user's status is calculated dynamically, so no need to update isClockedIn here.
    // We just save the new record.

    await writeData(newData);
    return newRecord;
};