
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ScpAdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/scp-admin/dashboard');
  }, [router]);

  return null;
}
