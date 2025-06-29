import React, { useState } from 'react';
import { sendXRP } from '../xrpl';

const SendTransaction = ({ account, wallet }) => {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSend = async () => {
    try {
      setError(null);
      setSuccess(null);

      if (!wallet) {
        throw new Error('Wallet is not available');
      }

      const result = await sendXRP(wallet, destination, amount);
      setSuccess('Transaction successful! Transaction ID: ' + result.result.tx_json.hash);
    } catch (error) {
      setError(error.message || 'Transaction failed');
    }
  };

  return (
    <div>
      <h3>Send XRP</h3>
      <input
        type="text"
        placeholder="Destination Address"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        style={{ padding: '10px', width: '300px', marginBottom: '10px' }}
      />
      <input
        type="text"
        placeholder="Amount (XRP)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ padding: '10px', width: '300px', marginBottom: '10px' }}
      />
      <button onClick={handleSend} style={{ padding: '10px', width: '100px' }}>Send</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default SendTransaction;
