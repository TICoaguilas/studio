import { ClockStation } from '@/components/ClockStation';
import { getUsers } from '@/lib/data';

export default async function Home() {
    const users = await getUsers();

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary">
                    Welcome to ClockWise
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Select your name to clock in or out. Your time is valuable, let's track it wisely.
                </p>
            </div>
            <ClockStation users={users} />
        </main>
    );
}
