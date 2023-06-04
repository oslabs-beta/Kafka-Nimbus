/* eslint-disable @next/next/no-img-element */
'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();
  return (
    <div className='flex gap-2'>
      <button
        className='btn-primary btn'
        onClick={
          sessionData
            ? () => void signOut()
            : () =>
                void signIn(undefined, { callbackUrl: '/cluster-dashboard' })
        }
      >
        {sessionData ? 'Sign out' : 'Sign in with Github'}
      </button>
      <img
        src='https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg'
        alt='github'
        width='34'
        height='34'
      />
    </div>
  );
};
