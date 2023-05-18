import { env } from '~/env.mjs';
import { createTRPCContext } from '~/server/api/trpc';
import { appRouter } from '~/server/api/root';
import { NextApiRequest, NextApiResponse } from 'next';

const nextApiHandler = createTRPCContext({
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
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return nextApiHandler
}
