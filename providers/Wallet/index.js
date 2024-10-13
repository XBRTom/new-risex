'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { Xumm } from 'xumm';
const WalletContext = createContext(null);
export { WalletContext };
export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [appName, setAppName] = useState('');
  const [status, setStatus] = useState('');
  const [xumm, setXumm] = useState(null);

  useEffect(() => {
    const initXumm = async () => {
      try {
        if (window.xumm) {
          setXumm(window.xumm);
          console.log('Xumm SDK initialized:', window.xumm);
        } else {
          // Fallback or mock for testing purposes
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
      if (!xumm) {
        return;
      }
      const userAccount = await xumm.user.account;
      setAccount(userAccount || '');
    };

    const getAppName = async () => {
      if (!xumm) {
        return;
      }
      const appDetails = await xumm.environment.jwt;
      setAppName(appDetails?.app_name || '');
    };

    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('status')) {
      setStatus(queryParams.get('status'));
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
    xumm.logout();
    setAccount('');
    setAppName('');
    console.log('Logged out');
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
