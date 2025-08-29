'use client';

import Transactions from '@/components/dashboard/Transactions';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/Loader';

export default function TransactionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="w-full h-screen bg-black text-white flex flex-col items-center justify-center space-y-3">
        <Loader size={32} />
        <span className="text-lg font-semibold">Loading Transactions...</span>
      </div>
    )
  }

  if (!session && status === 'unauthenticated') {
    router.push('/');
    return null; // Avoid rendering anything until redirect completes
  }

  return <Transactions />;
}
