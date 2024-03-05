import {NextPage} from 'next';
import React from 'react';

import {cn} from '@/lib/utils';

const IndexPage: NextPage = () => {
  return (
    <div
      className={cn(
        'flex min-h-screen w-full flex-1 flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100'
      )}
    >
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center bg-white px-8 py-12 dark:bg-zinc-900">
        <div className="mb-24 text-center">
          <h1 className="bg-gradient-to-br from-zinc-950 to-zinc-500 bg-clip-text text-5xl font-bold leading-normal text-transparent">
            RC Playground
          </h1>
          <p className="mt-2 text-lg text-zinc-600">
            Demo app to play around with the RC API{' '}
            <span className="mx-1">🚀</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default IndexPage;
