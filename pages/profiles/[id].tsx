import {NextPage} from 'next';
import {useRouter} from 'next/router';
import React from 'react';

import {cn} from '@/lib/utils';
import {useProfile} from '@/lib/api';
import Profile from '@/components/Profile';

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const {id} = router.query;
  const {data: profile, isLoading} = useProfile(Number(id));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div
      className={cn(
        'flex min-h-screen w-full flex-1 flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100'
      )}
    >
      <main className="mx-auto w-full max-w-4xl flex-1 bg-white px-8 py-12 dark:bg-zinc-900">
        <Profile person={profile} />
      </main>
    </div>
  );
};

export default ProfilePage;
