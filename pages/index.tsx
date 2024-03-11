import {NextPage} from 'next';
import React from 'react';
import {signIn, signOut, useSession} from 'next-auth/react';

import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import db from '@/lib/instant';

const IndexPage: NextPage = () => {
  const {data: session} = useSession();
  const {user} = db.useAuth();

  const handleSignOut = async () => {
    db.auth.signOut();
    await signOut();
  };

  return (
    <div
      className={cn(
        'flex min-h-screen w-full flex-1 flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100'
      )}
    >
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center bg-white px-8 py-12 dark:bg-zinc-900">
        <div className="mb-24 text-center">
          <h1
            className="bg-gradient-to-br from-zinc-950 to-zinc-500 bg-clip-text text-5xl font-bold leading-normal text-transparent"
            onClick={() => db.auth.signOut()}
          >
            RC Playground
          </h1>
          <p className="mt-2 text-lg text-zinc-600">
            Demo app to play around with the RC API{' '}
            <span className="mx-1">🚀</span>
          </p>
          <br />

          {session ? (
            <div className="flex flex-col items-center gap-4">
              <pre className="max-w-2xl overflow-auto whitespace-pre rounded bg-zinc-900 p-3 text-left text-sm text-zinc-100">
                <code>{JSON.stringify(session.user, null, 2)}</code>
              </pre>

              <Button
                size="lg"
                variant="outline"
                onClick={() => handleSignOut()}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button size="lg" onClick={() => signIn()}>
              Authenticate with Recurse
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default IndexPage;
