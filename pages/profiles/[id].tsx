import {NextPage} from 'next';
import React from 'react';

import {cn} from '@/lib/utils';

const ProfilePage: NextPage = () => {
  return (
    <div
      className={cn(
        'flex min-h-screen w-full flex-1 flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100'
      )}
    >
      <main className="mx-auto w-full max-w-4xl flex-1 bg-white px-8 py-12 dark:bg-zinc-900">
        {/* TODO: implement! */}
      </main>
    </div>
  );
};

export default ProfilePage;
