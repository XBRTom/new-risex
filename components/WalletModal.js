import React from 'react';
import { useWallet } from '../context/WalletContext';
import Modal from './Modal';

const WalletModal = ({ isOpen, onClose }) => {
  const { account, handleLogout } = useWallet();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-lg font-light mb-2 text-center text-black">RiseX Ledger</h3>
      <p className="text-sm text-center text-black mb-4">Wallet: {account}</p>
      <ul className="space-y-4">
        <li className="text-center">
          <button
            onClick={() => {
              handleLogout();
              onClose();
            }}
            className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </li>
      </ul>
    </Modal>
  );
};

export default WalletModal;
