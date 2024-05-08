import {NextPage} from 'next';
import React from 'react';

import {cn} from '@/lib/utils';
import db from '@/lib/instant';
import {Debugger} from '@/components/Debugger';

const BogoEatsPage: NextPage = () => {
  const {isLoading, error, data} = db.useQuery({
    channels: {},
    messages: {},
    users: {},
  });
  const {user, isLoading: isLoadingUser, error: authError} = db.useAuth();

  return (
    <div
      className={cn(
        'flex min-h-screen w-full flex-1 flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100'
      )}
    >
      <main className="mx-auto w-full max-w-4xl flex-1 bg-white px-4 py-12 dark:bg-zinc-900 sm:px-8">
        <h1 className="bg-gradient-to-br from-zinc-950 to-zinc-500 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl sm:leading-snug md:text-6xl md:leading-snug">
          Sandbox
        </h1>

        <div className="">
          <Debugger data={{user, ...data}} />
        </div>
      </main>
    </div>
  );
};

export default BogoEatsPage;
