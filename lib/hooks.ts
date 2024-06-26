import React from 'react';
import {tx} from '@instantdb/react';
import {useSession} from 'next-auth/react';

import db from '@/lib/instant';

export function useCombinedAuth() {
  const {data: session, status} = useSession();
  const {
    user: instantUser,
    isLoading: isLoadingUser,
    error: instantAuthError,
  } = db.useAuth();

  React.useEffect(() => {
    if (session && !instantUser && !isLoadingUser) {
      db.auth
        .signInWithToken(session.user.instantToken!)
        .then(() => console.log('Signed in with Instant!'))
        .catch((err) => console.error('Failed to sign in with Instant:', err));
    }
  }, [session, instantUser, isLoadingUser]);

  React.useEffect(() => {
    if (instantUser && session) {
      // TODO: make sure only appropriate fields are included here
      // and maybe include "lastSignedInAt" or something
      const u = {...instantUser, ...session.user, lastSignedInAt: Date.now()};
      // ensure user exists in instantdb
      db.transact(tx.users[u.id!].update(u));
    }
  }, [instantUser, session]);

  const isAuthenticated = status === 'authenticated';
  const user = isAuthenticated ? {...instantUser, ...session?.user} : null;

  return {
    session,
    status,
    user,
    isLoading: isLoadingUser || status === 'loading',
    error: instantAuthError,
  };
}
