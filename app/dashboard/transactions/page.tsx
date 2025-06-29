'use client'

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Transactions from '@/components/dashboard/Transactions';
import { cn } from "@/lib/utils"

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

const LoadingSpinner = ({
  size = 24,
  className,
  ...props
}: ISVGProps) => {
  return (
      <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
      >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
  );
};

export default function TransactionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div className="w-full h-screen bg-black text-white flex flex-col gap-2 items-center justify-center"><span>Loading</span><LoadingSpinner className="mr-2" /></div>
  }

  if (!session && status === 'unauthenticated') {
    router.push('/');
    return null; // Avoid rendering anything until redirect completes
  }

  return <Transactions />;
}
