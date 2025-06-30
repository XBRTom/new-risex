'use client';

import Overview from '@/components/dashboard/Overview';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/loader';

export default function UserPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Handle loading state with a refined loading indicator
  if (status === 'loading') {
    return <div className="w-full h-screen bg-black text-white flex flex-col gap-2 items-center justify-center"><span>Loading</span><Loader size={32} /></div>
  }

  // Redirect if unauthenticated, with null return to avoid rendering
  if (!session && status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  // Render Overview only if authenticated
  return <Overview />;
}
