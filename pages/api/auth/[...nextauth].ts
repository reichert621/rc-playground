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
          return {
            id: 'test',
            name: 'test',
            email: 'test@test.com',
            image: 'test-image.jpg',
          };
        },
      },
      profile(profile) {
        return profile;
      },
    },
  ],
};
export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
