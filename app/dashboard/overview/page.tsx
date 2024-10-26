'use client';

import Overview from '@/components/dashboard/Overview';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function UserPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Handle loading state with a refined loading indicator
  if (status === 'loading') {
    return <p>Loading...</p>; // Optional: Replace with a loading spinner or animation
  }

  // Redirect if unauthenticated, with null return to avoid rendering
  if (!session && status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  // Render Overview only if authenticated
  return <Overview />;
}
