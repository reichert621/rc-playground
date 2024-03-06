import React from 'react';
import {GlobeIcon, MailIcon, XIcon} from 'lucide-react';

import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {RcPerson} from '@/lib/api';
import {
  GithubIcon,
  LinkedInIcon,
  TwitterIcon,
  ZulipIcon,
} from '@/components/Icons';

function parseLinkedInUsername(url: string) {
  const parts = url.split('/').filter((part) => part.trim().length > 0);

  return parts[parts.length - 1];
}

const Profile = ({
  className,
  person,
}: {
  className?: string;
  person: RcPerson;
}) => {
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
        <div className="">
          <img
            className="aspect-square h-40 rounded-full border-4 border-zinc-300"
            src={imageUrl}
          />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h1 className="text-2xl font-bold leading-none text-zinc-900">
              {name || 'Anonymous'}
            </h1>

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
};

export const ProfileDialog = ({
  open,
  person,
  onClose,
}: {
  open?: boolean;
  person: RcPerson | null;
  onClose: () => void;
}) => {
  return (
    <Dialog open={open}>
      <DialogContent className="max-h-[90vh] gap-4 overflow-auto sm:max-w-xl">
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button
              className="absolute right-2 top-2"
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>
        {!!person && <Profile className="" person={person} />}
      </DialogContent>
    </Dialog>
  );
};
