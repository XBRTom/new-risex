'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as xaman from "@/libs/wallets/xaman";
import * as gem from "@/libs/wallets/gem";
import * as crossmark from "@/libs/wallets/crossmark";
import * as ledger from "@/libs/wallets/ledger";

type WalletType = 'xumm' | 'gemwallet' | 'ledger' | 'crossmark' | null;

interface WalletContextProps {
  walletAddress: string | null;
  walletType: WalletType;
  walletAppName: string | null;
  connectWallet: (type: WalletType) => void;
  disconnectWallet: () => void;
  setWalletAddress: React.Dispatch<React.SetStateAction<string | null>>;
  setWalletAppName: React.Dispatch<React.SetStateAction<string | null>>;
  setWalletType: React.Dispatch<React.SetStateAction<WalletType>>;
  signTransactionWallet: (transaction: any, return_url: string|null|undefined) => any;
  getInfoTransactionWallet: (uuid: string) => any;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

const walletHandlers = {
  xumm: xaman,
  gemwallet: gem,
  crossmark: crossmark,
  ledger: ledger,
};

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [walletAccount, setWalletAccount] = useState<string | null>(null);
  const [walletAppName, setWalletAppName] = useState<string | null>(null);

  const connectWallet = async (type: WalletType) => {
    if (type && walletHandlers[type]) {
      await walletHandlers[type].handleLogin();
      setWalletType(type);
      const address = await walletHandlers[type].getAccount();
      setWalletAddress(address);
      const appName = await walletHandlers[type].getAppName();
      setWalletAppName(appName);
    }
  };

  const disconnectWallet = async () => {
    if (walletType && walletHandlers[walletType]) {
      await walletHandlers[walletType].handleLogOut();
    }
    setWalletAddress(null);
    setWalletType(null);
    setWalletAppName(null);
    localStorage.removeItem('walletType');
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletAppName');
  };

  const signTransactionWallet = async (transaction: any, return_url: string|null|undefined) => {
    if (walletType && walletHandlers[walletType]) {
      return await walletHandlers[walletType].signTransaction(transaction, return_url);
    }
  };

  const getInfoTransactionWallet = async (uuid: string) => {
    if (walletType && walletHandlers[walletType]) {
      return await walletHandlers[walletType].getInfoTransaction(uuid);
    }
  };

  useEffect(() => {
    const storedWalletType = localStorage.getItem('walletType') as WalletType;
    const storedWalletAddress = localStorage.getItem('walletAddress');
    const storedWalletAppName = localStorage.getItem('walletAppName');

    if (storedWalletType) setWalletType(storedWalletType);
    if (storedWalletAddress) setWalletAddress(storedWalletAddress);
    if (storedWalletAppName) setWalletAppName(storedWalletAppName);
  }, []);

  useEffect(() => {
    if (walletType) localStorage.setItem('walletType', walletType);
    if (walletAddress) localStorage.setItem('walletAddress', walletAddress);
    if (walletAppName) localStorage.setItem('walletAppName', walletAppName);
  }, [walletType, walletAddress, walletAppName]);

  return (
    <WalletContext.Provider value={{
        walletAddress,
        walletType,
        walletAppName,
        connectWallet,
        disconnectWallet,
        setWalletAddress,
        setWalletType,
        setWalletAppName,
        signTransactionWallet,
        getInfoTransactionWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
