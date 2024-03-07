import type {NextApiRequest, NextApiResponse} from 'next';
import NextAuth, {AuthOptions} from 'next-auth';

import RcApiClient from '@/lib/rc';

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
    async jwt({token, account}) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({session, token, user}) {
      // Send properties to the client, like an access_token from a provider.
      session.user.token = token.accessToken as string;
      return session;
    },
  },
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
