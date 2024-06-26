import {NextPage} from 'next';
import React from 'react';
import {useRouter} from 'next/router';
import {useSession} from 'next-auth/react';
import Link from 'next/link';

import {cn} from '@/lib/utils';
import {RcPerson} from '@/lib/types/rc';
import {useCurrentBatchProfiles} from '@/lib/api';

const CurrentBatchPage: NextPage = () => {
  const router = useRouter();
  const {data: session, status} = useSession();

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push({pathname: '/', query: {redirect: router.asPath}});
    }
  }, [status]);

  const {
    data: profiles = [],
    isLoading,
    error,
  } = useCurrentBatchProfiles({
    // poll every 60s
    refreshInterval: 60000,
  });

  return (
    <div
      className={cn(
        'flex min-h-screen w-full flex-1 flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100'
      )}
    >
      <main className="mx-auto w-full max-w-4xl flex-1 bg-white px-8 py-12 dark:bg-zinc-900">
        <h1 className="bg-gradient-to-br from-zinc-950 to-zinc-500 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl sm:leading-snug md:text-6xl md:leading-snug">
          Currently at RC
        </h1>
        <p className="text-lg text-zinc-500">Who is in the current batches?</p>

        <div className="my-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {profiles.map((person) => {
            return (
              <Link
                key={person.id}
                href={`/users/${person.id}`}
                className="group overflow-hidden rounded border bg-zinc-900 shadow-sm duration-500 animate-in fade-in-0 hover:shadow"
              >
                <img
                  className="aspect-square w-full opacity-90 transition-opacity group-hover:opacity-100"
                  src={person.image_path}
                />
                <div className="w-full truncate bg-zinc-100 px-3 py-2 text-center text-sm font-medium text-zinc-800">
                  {person.name}
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default CurrentBatchPage;
