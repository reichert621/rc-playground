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
  const batches = await rc.fetchBatches();
  const [current, previous] = batches;
  const profiles = await Promise.all([
    rc.fetchProfiles({batch_id: current.id, limit: 50}),
    rc.fetchProfiles({batch_id: previous.id, limit: 50}),
  ]).then((r) => r.flat());

  return res.status(200).json({profiles});
}
