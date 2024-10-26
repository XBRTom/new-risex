import React, { useState } from 'react';
import XummTransactionHandler from './TransactionHandler';
import { X, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Pool {
  account: string;
  asset_currency: string;
  asset2_currency: string;
}

interface AddLiquidityModalProps {
  pool: Pool;
  closeModal: () => void;
}

export default function AddLiquidityModal({ pool, closeModal }: AddLiquidityModalProps) {
  const [amount1, setAmount1] = useState<string>('');
  const [amount2, setAmount2] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const handleSuccess = () => {
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      closeModal();
    }, 3000);
  };

  const handleError = () => {
    alert('Failed to add liquidity.');
  };

  const handleCancel = () => {
    alert('Sign in was canceled.');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={closeModal}></div>
      <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800 shadow-lg rounded-xl overflow-hidden w-full max-w-md z-10">
        <CardHeader className="border-b border-gray-800 pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-white">
              Add Liquidity
            </CardTitle>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Pool</span>
              <span className="text-sm font-medium text-white">
                {pool.asset_currency} / {pool.asset2_currency}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Address</span>
              <span className="text-sm font-medium text-white">
                {pool.account}
              </span>
            </div>
            <Separator className="bg-gray-800" />
            <div>
              <label htmlFor="amount1" className="block text-sm text-gray-400 mb-1">
                Amount of {pool.asset_currency}
              </label>
              <input
                type="number"
                id="amount1"
                value={amount1}
                onChange={(e) => setAmount1(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0.00"
              />
            </div>
            <div>
              <label htmlFor="amount2" className="block text-sm text-gray-400 mb-1">
                Amount of {pool.asset2_currency}
              </label>
              <input
                type="number"
                id="amount2"
                value={amount2}
                onChange={(e) => setAmount2(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0.00"
              />
            </div>
            <Separator className="bg-gray-800" />
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <XummTransactionHandler
                transactionType="AMMDeposit"
                pool={pool}
                amount1={amount1}
                amount2={amount2}
                onSuccess={handleSuccess}
                onError={handleError}
                onCancel={handleCancel}
              >
                {/*({ onClick }) => (
                  <button
                    onClick={onClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center"
                  >
                    <Plus size={18} className="mr-2" />
                    Add Liquidity
                  </button>
                )*/}
              </XummTransactionHandler>
            </div>
          </div>
        </CardContent>
      </Card>
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800 shadow-lg rounded-xl overflow-hidden z-10">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Success</h2>
              <p className="text-gray-300">Liquidity added successfully!</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                Close
              </button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}