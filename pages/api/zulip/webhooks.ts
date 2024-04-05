import type {NextApiRequest, NextApiResponse} from 'next';
import {load} from 'cheerio';
import Turndown from 'turndown';

import {fetchProfileById} from '@/lib/rc';
import {fetchZulipUserById} from '@/lib/zulip';

const td = new Turndown();

const RC_API_KEY = process.env.RC_API_KEY!;

function formatUserProfileMessage(record: any, debug = false) {
  const {email, user, profile} = record;

  if (debug || !profile) {
    return [
      email,
      '```json',
      JSON.stringify(profile || user, null, 2),
      '```',
    ].join('\n');
  }

  const {
    name,
    pronouns,
    slug,
    github,
    twitter,
    linkedin,
    before_rc_rendered,
    during_rc_rendered,
    interests_rendered,
    current_location,
  } = profile;

  return [
    `**${name}** (${pronouns})`,
    current_location && `📍 ${current_location.name}\n\n`,
    `- **RC Directory Profile**: https://www.recurse.com/directory/${slug}`,
    github && `- **Github**: https://github.com/${github}`,
    twitter && `- **Twitter**: https://twitter.com/${twitter}`,
    linkedin && `- **LinkedIn**: ${linkedin}`,
    before_rc_rendered && `\n**Before RC**\n${td.turndown(before_rc_rendered)}`,
    during_rc_rendered && `\n**During RC**\n${td.turndown(during_rc_rendered)}`,
    interests_rendered && `\n**Interests**\n${td.turndown(interests_rendered)}`,
  ]
    .filter((str) => !!str)
    .join('\n');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const params = {...req.body, ...req.query};
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && params.token !== process.env.ZULIP_BOT_TOKEN) {
    return res.status(401).json({error: 'Unauthorized'});
  }

  console.log('Webhook payload:', params);
  const {message = {}} = params;
  const messageContentHtml =
    message.rendered_content ||
    // Demo content for testing
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

      if (user.is_bot) {
        return null;
      }

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

  return res.status(200).json({
    users,
    content:
      users.length > 0
        ? users
            .filter((u) => !!u)
            .map((u) => formatUserProfileMessage(u, params.debug))
            .join('\n\n---\n\n')
        : 'No users found.',
  });
}
