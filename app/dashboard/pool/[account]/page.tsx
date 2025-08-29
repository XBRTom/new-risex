import AmmInfo from '@/components/dashboard/AmmInfo';
import { fetchAmmInfo } from '@/libs/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import PoolDetailClient from './PoolDetailClient';

const PoolDetailPage = async ({ params }: any) => {
  const account = params.account || '';
  
  if (!account) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-700 max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-red-400 flex items-center justify-center gap-2">
              <AlertCircle className="h-6 w-6" />
              Invalid Pool Account
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-400 mb-4">No pool account was provided.</p>
            <Button asChild>
              <Link href="/dashboard/overview">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Pass the account to client component for lazy loading
  return <PoolDetailClient account={account} />;
};

export default PoolDetailPage;
