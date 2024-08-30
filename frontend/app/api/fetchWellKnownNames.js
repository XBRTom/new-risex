import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://api.xrpscan.com/api/v1/names/well-known');
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Failed to fetch well-known names:', error);
    res.status(500).json({ error: 'Failed to fetch well-known names' });
  }
}
