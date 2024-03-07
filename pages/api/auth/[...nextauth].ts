import type {NextApiRequest, NextApiResponse} from 'next';
import NextAuth, {AuthOptions} from 'next-auth';

const options: AuthOptions = {
  providers: [
    {
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
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
          const opts = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${context.tokens.access_token}`,
            },
          };
          let resp = await fetch(
            `https://www.recurse.com/api/v1/profiles/me`,
            opts
          );
          let profile_info = await resp.json();
          console.log(profile_info);
          return {
            id: profile_info.id,
            name: profile_info.name,
            email: profile_info.email,
            image: profile_info.image_path,
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
