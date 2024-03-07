import type {NextApiRequest, NextApiResponse} from 'next';

import RcApiClient from '@/lib/rc';
import {extractAccessToken} from '@/lib/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const token = await extractAccessToken(req, res);

  if (!token) {
    return res.status(401).json({error: 'Access denied'});
  }

  const rc = new RcApiClient(token);
  const id = req.query.id as string;
  const profile = await rc.fetchProfileById(id);

  res.status(200).json({profile});
}
