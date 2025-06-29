'use client';

import React, { useState } from 'react';
import { useWallet } from '@/providers/Wallet';
import Modal from './Modal';
import Link from 'next/link';

const Navbar = () => {
  const { account, appName, handleLogin, handleLogout } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState('');

  const truncateAddress = (address) => {
    return `${address.slice(0, 3)}...${address.slice(-3)}`;
  };

  const handleLogoutClick = () => {
    handleLogout();
    setLogoutMessage('You have successfully logged out.');
    setTimeout(() => {
      setIsModalOpen(false);
      setLogoutMessage('');
    }, 3000);
  };

  return (
    <>
      <nav className="fixed w-full top-0 z-10 bg-black bg-opacity-75">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button */}
              <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex-shrink-0">
                <h1 className="text-white text-2xl font-bold">LIQUID</h1>
              </div>
              <div className="hidden sm:block sm:ml-6">
                <div className="flex space-x-4">
                  <Link href="/liquidity" className="text-gray-300 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Liquidity</Link>
                  {/* <a href="/swap" className="text-gray-300 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Swap</a> */}
                  {/* <a href="/trading" className="text-gray-300 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Trading</a> */}
                  <Link href="/transactions" className="text-gray-300 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Transactions</Link>
                  {/* <a href="/business" className="text-gray-300 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Business</a> */}
                </div>
              </div>
            </div>
            <div className="relative inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {account ? (
                <div className="relative">
                  <div className="text-white text-sm cursor-pointer" onClick={() => setIsModalOpen(true)}>
                    Wallet: {truncateAddress(account)}
                  </div>
                </div>
              ) : (
                <button onClick={handleLogin} className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Connect Wallet</button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/liquidity" className="text-gray-300 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium">Liquidity</Link>
            {/* <a href="/swap" className="text-gray-300 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium">Swap</a>
            <a href="/trading" className="text-gray-300 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium">Trading</a> */}
            <Link href="/transactions" className="text-gray-300 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium">Transactions</Link>
            {/* <a href="/business" className="text-gray-300 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium">Business</a> */}
          </div>
        </div>
      </nav>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-center">
          {logoutMessage ? (
            <div className="flex items-center justify-center space-x-2 mb-4">
              <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-500 text-sm">{logoutMessage}</p>
            </div>
          ) : (
            <>
              <h2 className="text-black text-lg font-semibold mb-4">{appName}</h2>
              <p className="text-black text-sm mb-4">Wallet: {account}</p>
              <a href="#activities" className="block px-4 py-2 text-sm text-gray-700 border border-gray-400 rounded-lg mb-2 hover:bg-black hover:text-white">My activities</a>
              <button
                onClick={handleLogoutClick}
                className="block w-full text-center px-4 py-2 text-sm text-gray-700 border border-gray-400 rounded-lg hover:bg-black hover:text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
