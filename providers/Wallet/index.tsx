'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Xumm } from 'xumm'; // Ensure this is the correct import if you have an Xumm SDK package

interface WalletContextProps {
  account: string | null;
  appName: string;
  handleLogin: () => Promise<void>;
  handleLogout: () => void;
  xumm: any; // You might want to refine this type based on the Xumm SDK structure
}

const WalletContext = createContext<WalletContextProps | null>(null);

export const useWallet = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [appName, setAppName] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [xumm, setXumm] = useState<any>(null); // Refine this type according to the actual structure of the Xumm SDK

  useEffect(() => {
    const initXumm = async () => {
      try {
        if (window.xumm) {
          setXumm(window.xumm);
          console.log('Xumm SDK initialized:', window.xumm);
        } else {
          console.warn('Xumm SDK not found, using mock for testing');
          const mockXumm = {
            authorize: async () => console.log('Mock authorization'),
            user: { account: 'mock_account' },
            environment: { jwt: { app_name: 'Mock App' } },
            logout: () => console.log('Mock logout'),
          };
          setXumm(mockXumm);
        }
      } catch (error) {
        console.error('Failed to initialize Xumm:', error);
      }
    };

    initXumm();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      if (!xumm) return;
      const userAccount = await xumm.user.account;
      setAccount(userAccount || '');
    };

    const getAppName = async () => {
      if (!xumm) return;
      const appDetails = await xumm.environment.jwt;
      setAppName(appDetails?.app_name || '');
    };

    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('status')) {
      setStatus(queryParams.get('status') || '');
    }

    if (xumm) {
      getAccount();
      getAppName();
    }
  }, [xumm]);

  const handleLogin = async () => {
    if (!xumm) {
      console.error('Xumm is not initialized yet.');
      return;
    }

    try {
      console.log('Attempting login with Xumm...');
      await xumm.authorize(); // Only attempt if xumm is initialized
      const userAccount = await xumm.user.account;
      setAccount(userAccount || '');
      const appDetails = await xumm.environment.jwt;
      setAppName(appDetails?.app_name || '');
      console.log('Login successful');
    } catch (error) {
      console.error('Authorization failed:', error);
    }
  };

  const handleLogout = () => {
    if (xumm) {
      xumm.logout();
      setAccount(null);
      setAppName('');
      console.log('Logged out');
    }
  };

  if (!xumm) {
    console.log('Xumm is not initialized yet.');
  }

  return (
    <WalletContext.Provider value={{ account, appName, handleLogin, handleLogout, xumm }}>
      {children}
    </WalletContext.Provider>
  );
};
