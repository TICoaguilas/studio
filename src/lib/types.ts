export type User = {
  id: string;
  name: string;
  isClockedIn: boolean;
  lastClockIn?: string; // Using ISO string for serialization
  password?: string;
};

export type TimeRecord = {
  id: string;
  userId: string;
  userName: string;
  type: 'in' | 'out';
  timestamp: string; // Using ISO string for serialization
  ipAddress: string;
  latitude?: number;
  longitude?: number;
};
