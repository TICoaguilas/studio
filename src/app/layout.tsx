import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/Header';
import { es } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns';

setDefaultOptions({ locale: es });

export const metadata: Metadata = {
  title: 'CPG LA MARINA',
  description: 'Una aplicación simple y eficiente para el seguimiento del tiempo.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col h-full">
        <Header />
        <div className="flex-1">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
