
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SecondaryNav } from '@/components/layout/secondary-nav';
import { ToastProvider } from '@/hooks/toast-provider';

export const metadata: Metadata = {
  title: 'Schengen visa gateway - Your Partner in Global Travel',
  description: 'A professional visa consultancy platform to help users explore global visa requirements.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased bg-background text-foreground min-h-screen flex flex-col')}>
        <ToastProvider>
          <div className="flex-grow w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <Header />
            <SecondaryNav />
            <main>
              {children}
            </main>
          </div>
          <Footer />
          <Toaster />
        </ToastProvider>
      </body>
    </html>
  );
}
