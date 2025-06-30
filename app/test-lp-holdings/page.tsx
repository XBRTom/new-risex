'use client';

import LPHoldingsTest from '@/components/dashboard/holdings/LPHoldingsTest';

export default function TestLPHoldingsPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">LP Holdings Test</h1>
          <p className="text-gray-400">
            Test the LP holdings calculation functionality by entering a wallet address
          </p>
        </div>
        
        <LPHoldingsTest />
      </div>
    </div>
  );
}
