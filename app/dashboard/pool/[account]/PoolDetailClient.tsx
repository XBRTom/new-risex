'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AmmInfo from '@/components/dashboard/AmmInfo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import apiClient from '@/libs/api';

interface PoolDetailClientProps {
  account: string;
}

export default function PoolDetailClient({ account }: PoolDetailClientProps) {
  const [ammInfo, setAmmInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const fetchAmmData = async (isRetry = false) => {
    try {
      if (isRetry) {
        setRetryCount(prev => prev + 1);
      }
      
      setLoading(true);
      setError(null);
      setProgress(20);

      console.log(`Fetching AMM info for account: ${account}${isRetry ? ` (retry ${retryCount + 1})` : ''}`);
      
      // Simulate progress during fetch
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 80));
      }, 200);

      const response = await apiClient.get(`/fetch-amm-info/${account}`);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      if (response && response.data) {
        setAmmInfo(response.data);
        console.log('Successfully loaded AMM info');
      } else {
        throw new Error('Invalid response data');
      }
    } catch (err: any) {
      console.error('Failed to fetch AMM info:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load pool information');
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 500); // Reset progress after a delay
    }
  };

  useEffect(() => {
    if (account) {
      fetchAmmData();
    }
  }, [account]);

  // Loading state with enhanced UI
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-700 max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-blue-400 flex items-center justify-center gap-2">
              <Clock className="h-6 w-6 animate-spin" />
              Loading Pool Details
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Fetching AMM information for:</p>
              <code className="bg-gray-800 px-2 py-1 rounded text-sm text-blue-400 block">
                {account}
              </code>
            </div>
            
            {progress > 0 && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-gray-500">
                  {progress < 30 ? 'Connecting to database...' :
                   progress < 60 ? 'Querying AMM data...' :
                   progress < 90 ? 'Processing relationships...' :
                   'Almost done...'}
                </p>
              </div>
            )}
            
            {retryCount > 0 && (
              <p className="text-xs text-yellow-400">
                Retry attempt {retryCount}
              </p>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard/overview')}
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel & Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state with retry functionality
  if (error) {
    const isNotFound = error.includes('not found') || error.includes('404');
    const canRetry = retryCount < 3 && !isNotFound;

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Card className="bg-gray-900 border-gray-700 max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className={`flex items-center justify-center gap-2 ${isNotFound ? 'text-yellow-400' : 'text-red-400'}`}>
              <AlertCircle className="h-6 w-6" />
              {isNotFound ? 'Pool Not Found' : 'Error Loading Pool'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">
                {isNotFound ? 'No AMM information found for:' : 'Failed to load pool information for:'}
              </p>
              <code className="bg-gray-800 px-2 py-1 rounded text-sm text-blue-400 block">
                {account}
              </code>
            </div>
            
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <p className="text-red-300 text-sm font-medium mb-1">Error Details:</p>
              <p className="text-gray-400 text-xs">{error}</p>
            </div>
            
            {isNotFound && (
              <p className="text-gray-500 text-sm">
                This pool may not exist in our AMM database or may not be indexed yet.
              </p>
            )}
            
            {retryCount > 0 && (
              <p className="text-yellow-400 text-xs">
                Attempted {retryCount} time{retryCount > 1 ? 's' : ''}
              </p>
            )}
            
            <div className="flex gap-2 justify-center">
              {canRetry && (
                <Button
                  onClick={() => fetchAmmData(true)}
                  variant="outline"
                  size="sm"
                  className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry ({3 - retryCount} left)
                </Button>
              )}
              
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard/overview">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            
            {!canRetry && !isNotFound && (
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
                <p className="text-blue-300 text-sm mb-2">💡 Troubleshooting Tips:</p>
                <ul className="text-xs text-gray-400 text-left space-y-1">
                  <li>• Check if the pool account is correct</li>
                  <li>• Try navigating from the pools table instead</li>
                  <li>• Contact support if the issue persists</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state - render the AmmInfo component
  if (ammInfo) {
    return <AmmInfo account={account} ammInfo={ammInfo} />;
  }

  // Fallback state
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <Card className="bg-gray-900 border-gray-700 max-w-md w-full mx-4">
        <CardContent className="text-center p-6">
          <p className="text-gray-400">Unexpected state. Please try again.</p>
          <Button asChild className="mt-4">
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
