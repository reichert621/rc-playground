import {NextPage} from 'next';
import React from 'react';

import {cn} from '@/lib/utils';

const CurrentBatchPage: NextPage = () => {
  return (
    <div
      className={cn(
        'flex min-h-screen w-full flex-1 flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100'
      )}
    >
      <main className="mx-auto w-full max-w-4xl flex-1 bg-white px-8 py-12 dark:bg-zinc-900">
        <h1 className="bg-gradient-to-br from-zinc-950 to-zinc-500 bg-clip-text text-4xl font-bold leading-normal text-transparent sm:text-5xl md:text-6xl">
          Currently at RC
        </h1>
        <p className="text-lg text-zinc-500">Who is in the current batches?</p>
        {/* TODO: implement me! */}
      </main>
    </div>
  );
};

export default CurrentBatchPage;
