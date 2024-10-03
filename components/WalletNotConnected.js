import React from 'react';

const WalletNotConnected = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-4xl font-bold pr-4 border-r border-gray-300">Pairing</h1>
        <p className="text-lg">Connect your wallet.</p>
      </div>
    </div>
  );
};

export default WalletNotConnected;
