'use client';
import { createNextApiHandler } from '@trpc/server/adapters/next';

import { env } from '~/env.mjs';
import { createTRPCContext } from '~/server/api/trpc';
import { appRouter } from '~/server/api/root';
import type { NextApiRequest, NextApiResponse } from 'next';

const nextApiHandler = createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
          );
        }
      : undefined,

});

// export API handler
function handler(req: NextApiRequest, res: NextApiResponse) {
    return nextApiHandler(req, res);
  }

export { handler as GET, handler as POST };
