'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  // Redirect to dashboard
  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return null;
}
