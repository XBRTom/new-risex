import React, { useState } from 'react';
import XummTransactionHandler from './TransactionHandler';

interface Pool {
  account: string;
  asset_currency: string;
  asset2_currency: string;
}

interface WithdrawLiquidityModalProps {
  pool: Pool;
  closeModal: () => void;
}

const WithdrawLiquidityModal: React.FC<WithdrawLiquidityModalProps> = ({ pool, closeModal }) => {
  const [amount1, setAmount1] = useState<string>('');
  const [amount2, setAmount2] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const handleSuccess = () => {
    setShowSuccessModal(true);
    closeModal();
  };

  const handleError = () => {
    alert('Failed to withdraw liquidity.');
  };

  const handleCancel = () => {
    alert('Sign in was canceled.');
  };

  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black opacity-50" onClick={closeModal}></div>
        <div className="bg-black rounded-lg p-6 z-10 text-white border border-gray-500">
          <h2 className="text-lg font-semibold mb-4">Withdraw Liquidity</h2>
          <p className="mb-2">Pair: {pool.asset_currency} / {pool.asset2_currency}</p>
          <p className="mb-4">Pool Address: {pool.account}</p>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Amount of {pool.asset_currency}</label>
            <input
              type="number"
              value={amount1}
              onChange={(e) => setAmount1(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-black text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Amount of {pool.asset2_currency}</label>
            <input
              type="number"
              value={amount2}
              onChange={(e) => setAmount2(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-black text-white"
            />
          </div>
          <div className="flex justify-end">
            <XummTransactionHandler
              transactionType="AMMWithdraw"
              pool={pool}
              amount1={amount1}
              amount2={amount2}
              onSuccess={handleSuccess}
              onError={handleError}
              onCancel={handleCancel}
            />
            <button
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-black rounded-lg p-6 z-10 text-white border border-gray-500">
            <h2 className="text-lg font-semibold mb-4">Success</h2>
            <p>Liquidity withdrawn successfully!</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawLiquidityModal;
