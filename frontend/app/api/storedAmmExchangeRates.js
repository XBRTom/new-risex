import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'ammExchangeRates.json');
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    res.status(200).json(JSON.parse(fileContents));
  } catch (error) {
    console.error('Failed to read exchange rates:', error);
    res.status(500).json({ error: 'Failed to read exchange rates' });
  }
}
