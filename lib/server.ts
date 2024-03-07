import type {NextApiRequest, NextApiResponse} from 'next';
import {getServerSession} from 'next-auth';

import {options} from '@/pages/api/auth/[...nextauth]';

export async function extractAccessToken(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<string | null> {
  const session = await getServerSession(req, res, options);
  const token = session?.user.token;

  if (token) {
    return token;
  }

  // Also allows passing in token from the client for testing :shrug:
  const params = {...req.query, ...req.body};
  const auth = req.headers.authorization;

  if (params.token) {
    return params.token as string;
  } else if (auth && auth.startsWith('Bearer ')) {
    const [_, token] = auth.split(' ');

    return token;
  } else {
    return null;
  }
}
