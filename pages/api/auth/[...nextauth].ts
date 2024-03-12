import type {NextApiRequest, NextApiResponse} from 'next';
import NextAuth, {AuthOptions} from 'next-auth';
import {init} from '@instantdb/admin';
import memoize from 'memoize';
import axios from 'axios';

import RcApiClient from '@/lib/rc';

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;
const ADMIN_API_KEY = process.env.INSTANT_ADMIN_API_KEY!;

const db = init({
  appId: APP_ID,
  adminToken: ADMIN_API_KEY,
});

function isTokenExpired(token: Record<string, any>) {
  if (!token) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  const expiry = Number(token.expiresAt);
  const forceExpire = expiry == 1710269450;
  const isExpired = expiry < now || forceExpire;
  // console.debug({expiry, now, valid: expiry > now});

  return isExpired;
}

// NB: we memoize to prevent an annoying race condition
// (discussion: https://github.com/nextauthjs/next-auth/discussions/3940)
const refreshAccessToken = memoize(async function (token: string) {
  try {
    const {data} = await axios.post('https://www.recurse.com/oauth/token', {
      client_id: process.env.RC_OAUTH_CLIENT_ID,
      client_secret: process.env.RC_OAUTH_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: token,
    });

    console.debug('[refreshAccessToken] result:', data);

    return data;
  } catch (error) {
    console.error('[refreshAccessToken] error:', error);
  }
});

export const options: AuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    {
      clientId: process.env.RC_OAUTH_CLIENT_ID,
      clientSecret: process.env.RC_OAUTH_CLIENT_SECRET,
      id: 'recurse',
      name: 'Recurse',
      type: 'oauth',
      authorization: {
        url: 'https://www.recurse.com/oauth/authorize',
        params: {
          scope: '',
        },
      },
      token: 'https://www.recurse.com/oauth/token',
      userinfo: {
        url: 'https://www.recurse.com/api/v1/profiles/me',
        async request(context) {
          const token = context.tokens.access_token;

          if (!token) {
            return {};
          }

          const client = new RcApiClient(token);
          const profile = await client.fetchCurrentUser();
          console.log('Found profile!', profile);

          return {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            image: profile.image_path,
          };
        },
      },
      profile(profile) {
        return profile;
      },
    },
  ],
  callbacks: {
    async jwt({token, account, user}) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        const instantToken = await db.auth.createToken(user.email!);

        return {
          ...token,
          instantToken,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at,
        };
      }

      // If token has expired, try to refresh
      if (isTokenExpired(token)) {
        console.debug('Expired! Attempting refresh...');
        const data = await refreshAccessToken(token.refreshToken as string);

        if (data.error) {
          console.error('Failed to refresh:', data);
          return token;
        } else {
          console.debug('Refreshed tokens:', data);
          return {
            ...token,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
          };
        }
      } else {
        return token;
      }
    },
    async session({session, token, user}) {
      // Send properties to the client, like an access_token from a provider.
      session.user.token = token.accessToken as string;
      session.user.instantToken = token.instantToken as string;

      return session;
    },
  },
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
