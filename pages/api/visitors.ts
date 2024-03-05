import type {NextApiRequest, NextApiResponse} from 'next';
import dayjs from 'dayjs';

import {fetchHubVisits, fetchProfileById} from '@/lib/rc';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const today = dayjs().format('YYYY-MM-DD');
  const visits = await fetchHubVisits({date: today});
  const visitors = await Promise.all(
    visits.map(async (v: any) => {
      const id = v.person.id;
      const profile = await fetchProfileById(id);

      return {...v, person: profile};
    })
  );

  res.status(200).json({visitors});
}
