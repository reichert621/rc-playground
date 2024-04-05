import type {NextApiRequest, NextApiResponse} from 'next';
import {load} from 'cheerio';

import {fetchProfileById} from '@/lib/rc';
import {fetchZulipUserById} from '@/lib/zulip';

const RC_API_KEY = process.env.RC_API_KEY!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const params = {...req.body, ...req.query};
  console.log('Webhook payload:', params);

  const {message = {}} = params;
  const messageContentHtml =
    message.rendered_content ||
    `
    <p>
      <span class="user-mention" data-user-id="690086">
        @Alex Reichert (he) (SP1\'24)
      </span>
    </p>
    `;
  const $ = load(messageContentHtml);
  const mentionedUserIds = $('.user-mention')
    .map((index, element) => $(element).attr('data-user-id'))
    .get();
  const users = await Promise.all(
    mentionedUserIds.map(async (id) => {
      const user = await fetchZulipUserById(id);
      const email = user.delivery_email || user.email;
      const profile = await fetchProfileById(email, RC_API_KEY!).catch(
        (err) => {
          console.error('RC profile not found:', err);

          return null;
        }
      );

      return {email, user, profile};
    })
  );
  console.log(users);

  return res.status(200).json({
    users,
    content:
      users.length > 0
        ? users
            .map((u) => {
              const {email, user, profile} = u;

              return [email, JSON.stringify(profile || user, null, 2)].join(
                '\n'
              );
            })
            .join('\n\n')
        : 'No users found.',
  });
}
