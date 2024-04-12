import {NextPage} from 'next';
import React from 'react';
import Link from 'next/link';
import {signIn, signOut, useSession} from 'next-auth/react';

import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import db from '@/lib/instant';
import {useCombinedAuth} from '@/lib/hooks';
import Spinner from '@/components/Spinner';

const IndexPage: NextPage = () => {
  const {session, user, isLoading} = useCombinedAuth();

  const handleSignOut = async () => {
    db.auth.signOut();
    await signOut();
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          'flex min-h-screen w-full flex-1 flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100'
        )}
      >
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center bg-white px-4 py-12 dark:bg-zinc-900">
          <Spinner className="h-8 w-8 text-zinc-500" />
        </main>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex min-h-screen w-full flex-1 flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100'
      )}
    >
      <header className="mx-auto w-full max-w-4xl bg-white px-4 py-3 dark:bg-zinc-900">
        {user ? (
          <div className="flex w-full items-center justify-between">
            <Link className="flex items-center gap-3" href="/users/me">
              <img
                className="h-8 w-8 rounded-full"
                src={user.image!}
                alt={user.name!}
              />
              <span className="text-sm font-medium text-zinc-400">
                {user.email}
              </span>
            </Link>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleSignOut()}
            >
              Sign out
            </Button>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between">
            <div className=""></div>

            <Button variant="outline" size="sm" onClick={() => signIn()}>
              Sign in
            </Button>
          </div>
        )}
      </header>
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center bg-white px-4 py-12 dark:bg-zinc-900">
        <div className="mb-24 mt-12 w-full">
          <h1
            className="bg-gradient-to-br from-zinc-950 to-zinc-500 bg-clip-text text-center text-5xl font-bold leading-normal text-transparent"
            onClick={() => db.auth.signOut()}
          >
            RC Playground
          </h1>
          <p className="mt-2 text-center text-lg text-zinc-600">
            Demo app to play around with the RC API{' '}
            <span className="mx-1">🚀</span>
          </p>
          <br />

          {session ? (
            <div className="mx-auto mt-8 grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
              <Link
                className="rounded-md border p-4 shadow transition-shadow hover:shadow-md"
                href="/visitors"
              >
                <h2 className="mt-1 text-lg font-bold text-zinc-900">
                  Visitors
                </h2>
                <p className="mt-0.5 text-base text-zinc-500">
                  Who is at the hub?
                </p>
              </Link>
              <Link
                className="rounded-md border p-4 shadow transition-shadow hover:shadow-md"
                href="/current"
              >
                <h2 className="mt-1 text-lg font-bold text-zinc-900">
                  Current batch
                </h2>
                <p className="mt-0.5 text-base text-zinc-500">
                  Who is in the current batch?
                </p>
              </Link>
              <Link
                className="rounded-md border p-4 shadow transition-shadow hover:shadow-md"
                href="/chat"
              >
                <h2 className="mt-1 text-lg font-bold text-zinc-900">Chat</h2>
                <p className="mt-0.5 text-base text-zinc-500">
                  Chat with other RC&apos;ers!
                </p>
              </Link>
              <Link
                className="rounded-md border p-4 shadow transition-shadow hover:shadow-md"
                href="/eats"
              >
                <h2 className="mt-1 text-lg font-bold text-zinc-900">
                  BOGO deals
                </h2>
                <p className="mt-0.5 text-base text-zinc-500">
                  UberEats deals near the hub!
                </p>
              </Link>
              <a
                className="rounded-md border p-4 shadow transition-shadow hover:shadow-md"
                href="https://github.com/reichert621/rc-playground"
                target="_blank"
              >
                <h2 className="mt-1 text-lg font-bold text-zinc-900">
                  Create your own
                </h2>
                <p className="mt-0.5 text-base text-zinc-500">
                  It&apos;s all open source!
                </p>
              </a>
              {/* 🏫🚌🎉👯‍♂️💬💡 */}
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-2xl items-center justify-center">
              <Button size="lg" onClick={() => signIn()}>
                Authenticate with Recurse
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default IndexPage;
