'use client';

import React, { useContext } from 'react';
import ProvideLiquidity from "@/components/ProvideLiquidity";
import { WalletContext } from "@/providers/Wallet";
import SendXRP from "@/components/SendXrp";

export default function Home() {
  
  const { account, appName, handleLogin, handleLogout } = useContext(WalletContext);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Risex Ledger App</h1>
      <p>Use the menu to navigate to different sections of the app.</p>
      <h2>{appName}</h2>
      {account ? (
        <div>
          <p>Connected account: <b>{account}</b></p>
          <button onClick={handleLogout}>Logout</button>
          <ProvideLiquidity account={account}/>
          <SendXRP account={account} />
        </div>
      ) : (
        <button onClick={handleLogin}>Connect to XUMM</button>
      )}
    </div>
    </main>
  );
}
