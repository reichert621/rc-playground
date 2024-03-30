import type {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const params = {...req.body, ...req.query};
  console.log('Webhook payload:', params);
  return res.status(200).json({data: params});
}
