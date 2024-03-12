import {NextPage} from 'next';
import React from 'react';
import {useSession} from 'next-auth/react';

import {cn} from '@/lib/utils';
import db, {reset, seed} from '@/lib/instant';
import {Button} from '@/components/ui/button';

function Debugger({className, data}: {className?: string; data: any}) {
  return (
    <div
      className={cn('rounded-md bg-black p-4 text-sm text-white', className)}
    >
      <pre>
        <code className="font-mono">{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
}

const DebuggerPage: NextPage = () => {
  const {data: session, status} = useSession();
  const {
    isLoading: isLoadingUser,
    user: instantUser,
    error: authError,
  } = db.useAuth();
  const {isLoading, error, data} = db.useQuery({
    channels: {},
    messages: {},
    users: {},
  });
  const sessionUser = session?.user || {};
  const user = {...instantUser, ...sessionUser};

  const handleResetDb = async () => {
    if (!data) {
      return;
    }

    return reset(data);
  };

  const handleSeedDb = async () => {
    if (!user.id || !data) {
      return;
    }

    const {channels = []} = data;

    if (channels.length > 0) {
      return;
    }

    return Promise.all([seed('general', user), seed('random', user)]);
  };

  const channels = data?.channels || [];

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-zinc-50 text-zinc-900">
      <main className="mx-auto w-full max-w-2xl flex-1 bg-white px-6 py-12">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Button
            disabled={channels.length > 0}
            size="lg"
            variant="default"
            onClick={handleSeedDb}
          >
            Seed
          </Button>
          <Button size="lg" variant="destructive" onClick={handleResetDb}>
            Reset
          </Button>
        </div>
        <div className="">
          <Debugger data={{user, ...data}} />
        </div>
      </main>
    </div>
  );
};

export default DebuggerPage;
