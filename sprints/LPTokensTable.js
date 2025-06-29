import React, { useState, useEffect } from 'react';
import Table from '../components/Table'; // Import the existing Table component for consistency
import AddLiquidityModal from '../components/AddLiquidityModal';
import WithdrawLiquidityModal from '../components/WithdrawLiquidityModal';
import { useWallet } from '../context/WalletContext';

const LPTokensTable = () => {
  const { lpTokenDetails } = useWallet();
  const [selectedPool, setSelectedPool] = useState(null);
  const [isAddLiquidityModalOpen, setIsAddLiquidityModalOpen] = useState(false);
  const [isWithdrawLiquidityModalOpen, setIsWithdrawLiquidityModalOpen] = useState(false);

  useEffect(() => {
    // Debugging line to check the structure and ensure lpTokenDetails is an array
    if (Array.isArray(lpTokenDetails)) {
      console.log('lpTokenDetails:', lpTokenDetails);
    } else {
      console.error('lpTokenDetails is not an array or is undefined/null:', lpTokenDetails);
    }
  }, [lpTokenDetails]);

  if (!Array.isArray(lpTokenDetails)) {
    console.error('Error: lpTokenDetails is not an array:', lpTokenDetails);
    return <div>Error: LP Token details are not properly loaded.</div>;
  }

  const openAddLiquidityModal = (poolAddress) => {
    setSelectedPool(poolAddress);
    setIsAddLiquidityModalOpen(true);
  };

  const closeAddLiquidityModal = () => {
    setIsAddLiquidityModalOpen(false);
    setSelectedPool(null);
  };

  const openWithdrawLiquidityModal = (poolAddress) => {
    setSelectedPool(poolAddress);
    setIsWithdrawLiquidityModalOpen(true);
  };

  const closeWithdrawLiquidityModal = () => {
    setIsWithdrawLiquidityModalOpen(false);
    setSelectedPool(null);
  };

  // Filter out entries where poolAddress is empty or lpTokens is 0
  const filteredData = lpTokenDetails.filter(detail => detail.poolAddress !== '' && (detail.deposit !== 0 || detail.withdraw !== 0));

  // Define table headers
  const headers = [
    { key: 'poolAddress', label: 'Pool Address' },
    { key: 'deposit', label: 'Deposit' },
    { key: 'withdraw', label: 'Withdraw' },
    { key: 'net', label: 'Net' },
    { key: 'current', label: 'Current' }, // Add the Current column
    { key: 'actions', label: 'Actions' }
  ];

  // Add action buttons to each row
  const dataWithActions = filteredData.map(data => ({
    ...data,
    actions: (
      <>
        <span
          className="text-green-500 cursor-pointer mr-2"
          onClick={() => openAddLiquidityModal(data.poolAddress)}
        >
          Add Liquidity
        </span>
        <span
          className="text-red-500 cursor-pointer"
          onClick={() => openWithdrawLiquidityModal(data.poolAddress)}
        >
          Withdraw
        </span>
      </>
    )
  }));

  return (
    <div className="mt-8">
      <h3 className="text-lg font-light mb-2 text-left text-white">LP Tokens Holdings</h3>
      <div className="overflow-x-auto">
        <Table headers={headers} data={dataWithActions} />
      </div>
      {isAddLiquidityModalOpen && (
        <AddLiquidityModal
          pool={selectedPool}
          closeModal={closeAddLiquidityModal}
        />
      )}
      {isWithdrawLiquidityModalOpen && (
        <WithdrawLiquidityModal
          pool={selectedPool}
          closeModal={closeWithdrawLiquidityModal}
        />
      )}
    </div>
  );
};

export default LPTokensTable;
