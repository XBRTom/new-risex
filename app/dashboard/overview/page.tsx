'use client';

import Overview from '@/components/dashboard/Overview';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/Loader';

export default function UserPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Handle loading state with a refined loading indicator
  if (status === 'loading') {
    return (
      <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center space-y-3">
        <Loader size={32} />
        <span className="text-lg font-semibold">Loading Dashboard...</span>
      </div>
    )
  }

  // Redirect if unauthenticated, with null return to avoid rendering
  if (!session && status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  // Render Overview only if authenticated
  return <Overview />;
}
