'use client';

import React, { useState } from 'react';

const SendXRP = ({ account, xumm }) => {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');

  const handleSendXRP = async () => {
    try {
      setStatus('Creating payment payload...');
      const payload = {
        TransactionType: 'Payment',
        Account: account,
        Amount: (parseFloat(amount) * 1000000).toString(), // Convert XRP to drops
        Destination: destination,
      };

      setStatus('Authorizing and signing transaction...');
      const createdPayload = await xumm.payload.createAndSubscribe(payload, event => {
        if (event.data.signed) {
          return true;
        }
      });

      const payloadUUID = createdPayload?.created?.uuid;

      if (!payloadUUID) {
        throw new Error('Failed to create payload');
      }

      const payloadURL = `https://xumm.app/sign/${payloadUUID}`;
      const newPopup = window.open(payloadURL, 'XummSign', 'width=500,height=600');

      const interval = setInterval(async () => {
        if (newPopup.closed) {
          clearInterval(interval);
          const resolvedPayload = await createdPayload.resolved;
          if (resolvedPayload?.signed) {
            setStatus('Transaction signed and submitted successfully!');
          } else {
            setStatus('Transaction was not signed.');
          }
        }
      }, 1000);
    } catch (error) {
      setStatus('Failed to send XRP: ' + error.message);
      console.error('Error sending XRP:', error);
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
      />
      <input
        type="text"
        placeholder="Amount in XRP"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleSendXRP}>Send XRP</button>
      <p>{status}</p>
    </div>
  );
};

export default SendXRP;
