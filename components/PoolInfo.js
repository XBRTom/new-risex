import React from 'react';

const PoolInfo = ({ ammInfo, auctionSlot, lpToken }) => {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-light text-white text-center">Pool Liquidity</h2>
      <div className="flex flex-col md:flex-row justify-center mt-6 space-y-6 md:space-y-0 md:space-x-6">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white">AMM Info</h3>
          <p className="text-white"><strong>Account:</strong> {ammInfo.account}</p>
          <p className="text-white"><strong>Amount:</strong> {ammInfo.amount}</p>
          <p className="text-white"><strong>Trading Fee:</strong> {ammInfo.trading_fee}</p>
          <p className="text-white"><strong>Issuer 2:</strong> {ammInfo.issuer2}</p>
        </div>
        {auctionSlot && (
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white">Auction Slot</h3>
            <p className="text-white"><strong>Account:</strong> {auctionSlot.account}</p>
            <p className="text-white"><strong>Discounted Fee:</strong> {auctionSlot.discounted_fee}</p>
            <p className="text-white"><strong>Expiration:</strong> {auctionSlot.expiration}</p>
            <p className="text-white"><strong>Price:</strong> {auctionSlot.price}</p>
          </div>
        )}
        {lpToken && (
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white">LP Token</h3>
            <p className="text-white"><strong>Currency:</strong> {lpToken.currency}</p>
            <p className="text-white"><strong>Issuer:</strong> {lpToken.issuer}</p>
            <p className="text-white"><strong>Value:</strong> {lpToken.value}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PoolInfo;
