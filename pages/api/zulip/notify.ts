import type {NextApiRequest, NextApiResponse} from 'next';
import axios from 'axios';
import qs from 'querystring';

import {extractAccessToken} from '@/lib/server';
import RcApiClient from '@/lib/rc';

const ZULIP_BOT_EMAIL = process.env.RC_SPACE_ZULIP_BOT_EMAIL!;
const ZULIP_API_KEY = process.env.RC_SPACE_ZULIP_API_KEY!;

const zulip = axios.create({
  baseURL: 'https://recurse.zulipchat.com/api/v1',
  auth: {
    username: ZULIP_BOT_EMAIL,
    password: ZULIP_API_KEY,
  },
});

async function sendDirectMessage({to, content}: {to: number; content: string}) {
  const {data} = await zulip.post(
    `/messages`,
    qs.stringify({
      to: JSON.stringify([to]),
      content,
      type: 'direct',
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const token = await extractAccessToken(req, res);

  if (!token) {
    return res.status(401).json({error: 'Access denied'});
  }

  const rc = new RcApiClient(token);
  const sender = await rc.fetchCurrentUser();
  const {zulipId, content} = req.body;

  if (!zulipId) {
    return res.status(400).json({error: 'A zulipId and content are required'});
  }

  console.log('Notify params:', {zulipId, content});
  const message = await sendDirectMessage({
    to: 690086, // me
    content: `**${sender.name} posted on [your wall](https://rc-playground-2024.vercel.app/users/me)**:\n${content}`,
  });

  return res.status(200).json({message});
}
