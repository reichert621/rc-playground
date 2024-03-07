import type {NextApiRequest, NextApiResponse} from 'next';

import {fetchProfileById} from '@/lib/rc';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const id = req.query.id as string;
  const profile = await fetchProfileById(id);

  res.status(200).json({profile});
}
