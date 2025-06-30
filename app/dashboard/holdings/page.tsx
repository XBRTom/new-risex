'use client';

import Holdings from '@/components/dashboard/Holdings';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/loader';

export default function HoldingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div className="w-full h-screen bg-black text-white flex flex-col gap-2 items-center justify-center"><span>Loading</span><Loader size={32} /></div>
  }

  if (!session && status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  return <Holdings />;
}
