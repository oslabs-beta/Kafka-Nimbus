import {
  type FetchCreateContextFnOptions,
  fetchRequestHandler,
} from '@trpc/server/adapters/fetch';
import { prisma } from '~/server/db';

import { env } from '~/env.mjs';
import { createTRPCContext } from '~/server/api/trpc';
import { appRouter } from '~/server/api/root';
import type { NextApiRequest, NextApiResponse } from 'next';

// const nextApiHandler = fetchRequestHandler({
//   router: appRouter,
//   createContext: createTRPCContext,
//   onError:
//     env.NODE_ENV === 'development'
//       ? ({ path, error }) => {
//           console.error(
//             `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
//           );
//         }
//       : undefined,
// });

// export API handler

const handler = (request: Request) => {
  console.log(`incoming request ${request.url}`);
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: function (
      opts: FetchCreateContextFnOptions
    ): object | Promise<object> {
      return {};
    },
  });
};



export { handler as GET, handler as POST };
