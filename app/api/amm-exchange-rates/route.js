// pages/api/ammExchangeRates.js
import { NextResponse} from "next/server";
import axios from 'axios';
// import prisma from '../../libs/prisma'; // Adjust the path as necessary


export async function GET(req, res) {
  // const { base, counter } = req.query;
  const { searchParams } = new URL(req.url);

  // Extract 'base' and 'counter' from the query parameters
  const base = searchParams.get('base');
  const counter = searchParams.get('counter');
  // console.log('Request Params:', { base, counter });

  if (!base || !counter) {
    return NextResponse.json({ error: 'Missing required query parameters' }, {status: 400});
  }

  try {
    const baseFormatted = base ? base.replace('.', '_') : 'XRP';
    const counterFormatted = counter ? counter.replace('.', '_') : 'USD';
    const response = await axios.get(`https://data.xrplf.org/v1/iou/exchange_rates/${baseFormatted}/${counterFormatted}?amm_only=true`);
    const rate = response.data.rate;
    // console.log('API Rate:', rate); // Log the rate
    // res.status(200).json(rate);
    return NextResponse.json({rate: rate}, {status: 200});
  } catch (error) {
    if (error.response) {
      console.error('Error Response Data:', error.response.data);
      console.error('Error Response Status:', error.response.status);
      console.error('Error Response Headers:', error.response.headers);
      // res.status(500).json({ error: error.response.data });
      return NextResponse.json({ error: error.response.data }, {status: 500});
    } else if (error.request) {
      console.error('Error Request Data:', error.request);
      // res.status(500).json({ error: 'No response received from external API' });
      return NextResponse.json({ error: 'No response received from external API' }, {status: 500});
    } else {
      console.error('Error Message:', error.message);
      // res.status(500).json({ error: error.message });
      return NextResponse.json({ error: error.message }, {status: 500});
    }
  }
};

