/* eslint-disable @next/next/no-img-element */
'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { motion } from "framer-motion";

export const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();
  return (
    <div className='flex gap-2'>
      <motion.button
        className='btn-primary btn'
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.8 }}
        onClick={
          sessionData
            ? () => void signOut({ callbackUrl: '/' })
            : () =>
              void signIn(undefined, { callbackUrl: '/cluster-dashboard' })
              
        }
      >
        {sessionData ? 'Sign out' : 'Sign in with Github'}
      </motion.button>
      <img
        src='https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg'
        alt='github'
        width='34'
        height='34'
      />
    </div>
  );
};
