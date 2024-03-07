import {NextPage} from 'next';
import React from 'react';

import {cn} from '@/lib/utils';
import {signIn, useSession} from 'next-auth/react';

const IndexPage: NextPage = () => {
  const {data: session} = useSession();
  const notLoggedIn = session === null;

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
          <br />
          {notLoggedIn && (
            <button
              className="ring-offset-background focus-visible:ring-ring inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              onClick={() => signIn()}
            >
              Authenticate with Recurse
            </button>
          )}
          {session && <p>Access Token {session?.user.token}</p>}
        </div>
      </main>
    </div>
  );
};

export default IndexPage;
