import { AdminDashboard } from '@/components/AdminDashboard';
import { getTimeRecords, getUsers } from '@/lib/data';

export default async function AdminPage() {
    const records = await getTimeRecords();
    const users = await getUsers();
    const userNames = users.map(u => u.name);

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">Admin Dashboard</h1>
                <p className="mt-2 text-lg text-muted-foreground">View and export employee time records.</p>
            </div>
            <AdminDashboard records={records} userNames={userNames} />
        </main>
    );
}
