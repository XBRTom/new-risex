// File: /pages/api/xumm-webhook.ts

import { NextApiRequest, NextApiResponse } from 'next';

// This is the main webhook handler function
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const transactionDetail = req.body;

    // Log the transaction detail for debugging
    console.log('Transaction Detail:', transactionDetail);

    // Handle the transaction details here (e.g., save them to a database, trigger other actions)
    
    res.status(200).send('Webhook received successfully');
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
