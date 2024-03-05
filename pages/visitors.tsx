import {NextPage} from 'next';
import React from 'react';

import {cn} from '@/lib/utils';
import {RcPerson, useHubVisitors} from '@/lib/api';
import {ProfileDialog} from '@/components/ProfileDialog';

const IndexPage: NextPage = () => {
  const [selected, setSelectedProfile] = React.useState<RcPerson | null>(null);
  const [isViewingProfile, setViewingState] = React.useState(false);
  const {
    data: visitors = [],
    isLoading,
    error,
  } = useHubVisitors({
    // poll every 60s
    refreshInterval: 60000,
  });

  const handleSelectProfile = (person: RcPerson) => {
    setSelectedProfile(person);
    setViewingState(true);
  };

  return (
    <div
      className={cn(
        'flex min-h-screen w-full flex-1 flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100'
      )}
    >
      <main className="mx-auto w-full max-w-4xl flex-1 bg-white px-8 py-12 dark:bg-zinc-900">
        <h1 className="bg-gradient-to-br from-zinc-950 to-zinc-500 bg-clip-text text-4xl font-bold leading-normal text-transparent sm:text-5xl md:text-6xl">
          Visitors
        </h1>
        <p className="text-lg text-zinc-500">Who is at the hub today?</p>

        <div className="my-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {visitors
            .sort((a, b) => {
              return +new Date(b.updated_at) - +new Date(a.updated_at);
            })
            .map((visitor) => {
              const {person} = visitor;

              return (
                <button
                  key={person.id}
                  className="group overflow-hidden rounded border bg-zinc-900 shadow-sm duration-500 animate-in fade-in-0 hover:shadow"
                  onClick={() => handleSelectProfile(person)}
                >
                  <img
                    className="aspect-square w-full opacity-90 transition-opacity group-hover:opacity-100"
                    src={person.image_path}
                  />
                  <div className="w-full bg-zinc-100 px-3 py-2 text-center text-sm font-medium text-zinc-800">
                    {person.name}
                  </div>
                </button>
              );
            })}
        </div>
        <ProfileDialog
          open={isViewingProfile}
          person={selected}
          onClose={() => setViewingState(false)}
        />
      </main>
    </div>
  );
};

export default IndexPage;
