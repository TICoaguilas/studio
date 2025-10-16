import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { BookCopy } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Header() {
    const logo = PlaceHolderImages.find(p => p.id === 'logo');

    return (
        <header className="bg-card border-b sticky top-0 z-20 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-3 font-bold text-xl text-primary">
                        {logo && <Image src={logo.imageUrl} alt={logo.description} data-ai-hint={logo.imageHint} width={32} height={32} className="rounded-md" />}
                        <span className="font-headline">ClockWise</span>
                    </Link>
                    <nav>
                        <Button asChild variant="ghost">
                            <Link href="/admin">
                                <BookCopy className="mr-2 h-4 w-4" />
                                Admin Panel
                            </Link>
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    );
}
