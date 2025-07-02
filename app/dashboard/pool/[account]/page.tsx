import AmmInfo from '@/components/dashboard/AmmInfo';
import { fetchAmmInfo } from '@/libs/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
  
  try {
    const ammInfo = await fetchAmmInfo(account);
    
    if (!ammInfo) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <Card className="bg-gray-900 border-gray-700 max-w-md w-full mx-4">
            <CardHeader className="text-center">
              <CardTitle className="text-yellow-400 flex items-center justify-center gap-2">
                <AlertCircle className="h-6 w-6" />
                Pool Not Found
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-400 mb-2">No AMM information found for account:</p>
              <code className="bg-gray-800 px-2 py-1 rounded text-sm text-blue-400">{account}</code>
              <p className="text-gray-500 text-sm mt-2 mb-4">This pool may not exist or may not be indexed yet.</p>
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
    
    return (
      <div>
        <AmmInfo account={account} ammInfo={ammInfo}/>
      </div>
    );
  } catch (error) {
    console.error('Error loading pool detail page:', error);
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-700 max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-red-400 flex items-center justify-center gap-2">
              <AlertCircle className="h-6 w-6" />
              Error Loading Pool
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-400 mb-2">Failed to load pool information for:</p>
            <code className="bg-gray-800 px-2 py-1 rounded text-sm text-blue-400">{account}</code>
            <p className="text-gray-500 text-sm mt-2 mb-4">Please try again later or contact support if the issue persists.</p>
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
};

export default PoolDetailPage;
