import React from 'react';
import Link from 'next/link';
import {GlobeIcon, MailIcon, SchoolIcon, UserIcon} from 'lucide-react';

import {Label} from '@/components/ui/label';
import {RcPerson} from '@/lib/types/rc';
import {
  GithubIcon,
  LinkedInIcon,
  TwitterIcon,
  ZulipIcon,
} from '@/components/Icons';
import {parseLinkedInUsername} from '@/lib/utils';
import Markdown from '@/components/Markdown';

export function PersonOverview({person}: {person: RcPerson}) {
  const {
    name,
    pronouns,
    image_path: imageUrl,
    current_location,
    stints = [],
  } = person;
  const [stint] = stints;

  return (
    <div className="mb-4 flex gap-4 border-b-2 border-zinc-100 pb-4">
      <div className="">
        <img
          className="aspect-square h-20 w-20 rounded-lg border-2 border-zinc-300"
          src={imageUrl}
        />
      </div>
      <div className="flex-1">
        <h1 className="text-base font-bold leading-none text-zinc-900">
          {name || 'Anonymous'}
        </h1>

        <div className="mt-2 flex flex-col gap-2">
          {!!pronouns && (
            <span className="inline-flex items-center gap-1 ">
              <UserIcon className="h-3 w-3 text-zinc-400" />
              <small className="text-xs leading-none text-zinc-500">
                {pronouns}
              </small>
            </span>
          )}
          {!!current_location && (
            <span className="inline-flex items-center gap-1 ">
              <GlobeIcon className="h-3 w-3 text-zinc-400" />
              <small className="text-xs leading-none text-zinc-500">
                {current_location?.name}
              </small>
            </span>
          )}
          {!!stint && (
            <span className="inline-flex items-center gap-1 ">
              <SchoolIcon className="h-3 w-3 text-zinc-400" />
              <small className="text-xs leading-none text-zinc-500">
                {stint.batch?.name || stint.title}
              </small>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function PersonContactInfo({person}: {person: RcPerson}) {
  const {email, twitter, github, linkedin, zulip_id: zulipId} = person;

  return (
    <div className="mb-4 flex flex-col gap-3">
      {!!email && (
        <a
          className="group flex items-center gap-1.5"
          href={`mailto:${email}`}
          target="_blank"
        >
          <MailIcon className="h-4 w-4 text-zinc-500 group-hover:text-zinc-700" />
          <div className="text-sm leading-none text-zinc-700 group-hover:text-zinc-900">
            {email}
          </div>
        </a>
      )}
      {!!github && (
        <a
          className="group flex items-center gap-1.5"
          href={`https://github.com/${github}`}
          target="_blank"
        >
          <GithubIcon className="h-4 w-4 text-zinc-500 group-hover:text-zinc-700" />
          <div className="text-sm leading-none text-zinc-700 group-hover:text-zinc-900">
            {github}
          </div>
        </a>
      )}
      {!!twitter && (
        <a
          className="group flex items-center gap-1.5"
          href={`https://twitter.com/${twitter}`}
          target="_blank"
        >
          <TwitterIcon className="h-4 w-4 text-zinc-500 group-hover:text-zinc-700" />
          <div className="text-sm leading-none text-zinc-700 group-hover:text-zinc-900">
            @{twitter}
          </div>
        </a>
      )}
      {!!linkedin && (
        <a
          className="group flex items-center gap-1.5"
          href={linkedin}
          target="_blank"
        >
          <LinkedInIcon className="h-4 w-4 text-zinc-500 group-hover:text-zinc-700" />
          <div className="text-sm leading-none text-zinc-700 group-hover:text-zinc-900">
            {parseLinkedInUsername(linkedin)}
          </div>
        </a>
      )}
      {!!zulipId && (
        <a
          className="group flex items-center gap-1.5"
          href={`https://recurse.zulipchat.com/#narrow/stream/18961-checkins/topic/${person.name}`}
          target="_blank"
        >
          <ZulipIcon
            className="h-4 w-4 rounded text-zinc-500 group-hover:text-zinc-700"
            gradientFrom="#a1a1aa"
            gradientTo="#3f3f46"
          />
          <div className="text-sm leading-none text-zinc-700 group-hover:text-zinc-900">
            check-ins
          </div>
        </a>
      )}
    </div>
  );
}

export function PersonAbout({person}: {person: RcPerson}) {
  const {
    before_rc_hl: beforeRc,
    during_rc_hl: duringRc,
    interests_hl: interests,
    stints = [],
  } = person;
  const [stint] = stints;

  return (
    <div className="mb-4 flex flex-col gap-4">
      {!!beforeRc && (
        <div>
          <Label className="">Before RC</Label>
          <Markdown>{beforeRc}</Markdown>
        </div>
      )}
      {!!duringRc && (
        <div>
          <Label className="">What I&apos;d like to work on</Label>
          <Markdown>{duringRc}</Markdown>
        </div>
      )}
      {interests && (
        <div>
          <Label className="">Interests</Label>
          <Markdown>{interests}</Markdown>
        </div>
      )}
    </div>
  );
}

export default function Profile({
  className,
  person,
}: {
  className?: string;
  person: RcPerson;
}) {
  const {
    name,
    email,
    pronouns,
    image_path: imageUrl,
    twitter,
    github,
    linkedin,
    current_location,
    zulip_id: zulipId,
    before_rc_hl: beforeRc,
    during_rc_hl: duringRc,
    interests_hl: interests,
    stints = [],
  } = person;
  const [stint] = stints;

  return (
    <div className={className}>
      <div className="mb-6 flex gap-8 border-b-2 border-zinc-100 pb-6">
        <Link href={`/users/${person.id}`} className="">
          <img
            className="aspect-square h-40 rounded-full border-4 border-zinc-300"
            src={imageUrl}
          />
        </Link>
        <div className="flex-1 space-y-3">
          <div>
            <Link href={`/users/${person.id}`}>
              <h1 className="text-2xl font-bold leading-none text-zinc-900">
                {name || 'Anonymous'}
              </h1>
            </Link>

            <div className="flex items-center gap-1">
              {[
                !!pronouns && (
                  <small className=" text-xs text-zinc-500">{pronouns}</small>
                ),
                !!pronouns && !!stint && (
                  <span className="text-zinc-400">{' · '}</span>
                ),
                !!stint && (
                  <small className=" text-xs text-zinc-500">
                    {stint.batch?.name || stint.title}
                  </small>
                ),
                (!!pronouns || !!stint) && !!current_location && (
                  <span className="text-zinc-400">{' · '}</span>
                ),
                !!current_location && (
                  <span className="inline-flex items-center gap-1 ">
                    <GlobeIcon className="h-3 w-3 text-zinc-400" />
                    <small className="text-xs leading-none text-zinc-500">
                      {current_location?.name}
                    </small>
                  </span>
                ),
              ]}
            </div>
          </div>

          {!!email && (
            <a
              className="group flex items-center gap-1.5"
              href={`mailto:${email}`}
              target="_blank"
            >
              <MailIcon className="h-4 w-4 text-zinc-500 group-hover:text-zinc-700" />
              <div className="text-sm leading-none text-zinc-700 group-hover:text-zinc-900">
                {email}
              </div>
            </a>
          )}
          {!!github && (
            <a
              className="group flex items-center gap-1.5"
              href={`https://github.com/${github}`}
              target="_blank"
            >
              <GithubIcon className="h-4 w-4 text-zinc-500 group-hover:text-zinc-700" />
              <div className="text-sm leading-none text-zinc-700 group-hover:text-zinc-900">
                {github}
              </div>
            </a>
          )}
          {!!twitter && (
            <a
              className="group flex items-center gap-1.5"
              href={`https://twitter.com/${twitter}`}
              target="_blank"
            >
              <TwitterIcon className="h-4 w-4 text-zinc-500 group-hover:text-zinc-700" />
              <div className="text-sm leading-none text-zinc-700 group-hover:text-zinc-900">
                @{twitter}
              </div>
            </a>
          )}
          {!!linkedin && (
            <a
              className="group flex items-center gap-1.5"
              href={linkedin}
              target="_blank"
            >
              <LinkedInIcon className="h-4 w-4 text-zinc-500 group-hover:text-zinc-700" />
              <div className="text-sm leading-none text-zinc-700 group-hover:text-zinc-900">
                {parseLinkedInUsername(linkedin)}
              </div>
            </a>
          )}
          {!!zulipId && (
            <a
              className="group flex items-center gap-1.5"
              href={`https://recurse.zulipchat.com/#narrow/stream/18961-checkins/topic/${person.name}`}
              target="_blank"
            >
              <ZulipIcon
                className="h-4 w-4 rounded text-zinc-500 group-hover:text-zinc-700"
                gradientFrom="#a1a1aa"
                gradientTo="#3f3f46"
              />
              <div className="text-sm leading-none text-zinc-700 group-hover:text-zinc-900">
                check-ins
              </div>
            </a>
          )}
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3">
        {!!beforeRc && (
          <div>
            <Label className="">Before RC</Label>
            <p className="text-sm text-zinc-700">{beforeRc}</p>
          </div>
        )}
        {!!duringRc && (
          <div>
            <Label className="">What I&apos;d like to work on</Label>
            <p className="text-sm text-zinc-700">{duringRc}</p>
          </div>
        )}
        {interests && (
          <div>
            <Label className="">Interests</Label>
            <p className="text-sm text-zinc-700">{interests}</p>
          </div>
        )}
      </div>
    </div>
  );
}
