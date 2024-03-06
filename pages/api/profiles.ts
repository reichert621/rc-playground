import type {NextApiRequest, NextApiResponse} from 'next';

import {fetchBatches, fetchProfiles} from '@/lib/rc';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const batches = await fetchBatches();
  const [current, previous] = batches;
  const profiles = await Promise.all([
    fetchProfiles({batch_id: current.id, limit: 50}),
    fetchProfiles({batch_id: previous.id, limit: 50}),
  ]).then((r) => r.flat());

  res.status(200).json({profiles});
}
