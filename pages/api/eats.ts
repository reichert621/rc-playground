import type {NextApiRequest, NextApiResponse} from 'next';
import axios from 'axios';

// Proxy endpoint for https://recurse-eats.dim.codes
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{deals: any[]}>
) {
  const {data} = await axios.get('https://recurse-eats.dim.codes/scraped.json');

  res.status(200).json({deals: data});
}
