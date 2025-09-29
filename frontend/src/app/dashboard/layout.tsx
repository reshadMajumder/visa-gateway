
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    if (!loggedIn) {
      router.push('/login');
    }
  }, [router]);

  if (!isClient || !isLoggedIn) {
    return null; // or a loading spinner
  }

  return (
    <div className="min-h-screen w-full">
      <main className="p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
