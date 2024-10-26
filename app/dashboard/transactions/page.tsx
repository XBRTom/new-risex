'use client'

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Transactions from '@/components/dashboard/Transactions';

export default function TransactionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <p>Loading...</p>; // Optional: Replace with a loading spinner for better UX
  }

  if (!session && status === 'unauthenticated') {
    router.push('/');
    return null; // Avoid rendering anything until redirect completes
  }

  return <Transactions />;
}
