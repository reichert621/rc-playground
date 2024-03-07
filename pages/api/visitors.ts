import type {NextApiRequest, NextApiResponse} from 'next';
import dayjs from 'dayjs';

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
  const today = dayjs().format('YYYY-MM-DD');
  const visits = await rc.fetchHubVisits({date: today});
  const visitors = await Promise.all(
    visits.map(async (v: any) => {
      const id = v.person.id;
      const profile = await rc.fetchProfileById(id);

      return {...v, person: profile};
    })
  );

  return res.status(200).json({visitors});
}
