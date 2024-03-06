
import React from 'react';
import {GlobeIcon, MailIcon} from 'lucide-react';
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

export const Profile = ({
  className,
  person,
}: {
  className?: string;
  person: RcPerson;
}) => {
  // ... existing Profile component code ...
};
