'use client';

import Holdings from '@/components/dashboard/Holdings';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/Loader';

export default function HoldingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center space-y-3">
        <Loader size={32} />
        <span className="text-lg font-semibold">Loading Holdings...</span>
      </div>
    )
  }

  if (!session && status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  return <Holdings />;
}
