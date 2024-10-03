'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { Xumm } from 'xumm';

const WalletContext = createContext(null);
export { WalletContext };

export const useWallet = () => useContext(WalletContext);

// let xumm;
// try{
//   xumm = new Xumm('5ea5cad0-1d8e-4cee-a31e-96a8f2297dea'); // Replace with your XUMM API key
// }catch(err){
  
//   console.log("XUMM build ERROR IN WALLET PROVIDER ", err);
// }

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [appName, setAppName] = useState('');
  const [status, setStatus] = useState('');
  const [xumm, setXumm] = useState(null);
  // const xumm = new Xumm('5ea5cad0-1d8e-4cee-a31e-96a8f2297dea'); // Replace with your XUMM API key

  useEffect(() => {
    const initXumm = async () => {
      try {
        if (window.xumm) {
          setXumm(window.xumm);
        } else {
          console.error('Xumm object is not available on the window');
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
    if(xumm){
      getAccount();
      getAppName();
    }
    getAccount();
    getAppName();
  }, [xumm, xumm?.environment.jwt, xumm?.user.account]);

  const handleLogin = async () => {
    try {
      await xumm.authorize();
      const userAccount = await xumm.user.account;
      setAccount(userAccount || '');
      const appDetails = await xumm.environment.jwt;
      setAppName(appDetails?.app_name || '');
    } catch (error) {
      console.error('Authorization failed:', error);
    }
  };

  const handleLogout = () => {
    xumm.logout();
    setAccount('');
    setAppName('');
  };

  return (
    <WalletContext.Provider value={{ account, appName, handleLogin, handleLogout, xumm }}>
      {children}
    </WalletContext.Provider>
  );
};
