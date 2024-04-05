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
      const profile = await fetchProfileById(user.email, RC_API_KEY!);

      return {user, profile};
    })
  );

  return res.status(200).json({
    users,
    content: `Found the following user(s): ${users.map((u) => u.user.email).join(', ')}`,
  });
}
