import {
  type FetchCreateContextFnOptions,
  fetchRequestHandler
} from '@trpc/server/adapters/fetch';
import { PrismaClient } from '@prisma/client';
import { appRouter } from '~/server/api/root';

/**
 * Workaround to get trpc to work on app router, so that it condenses everything
 * into one route, and it's updated automatically.
 */
const handler = (request: Request) => {
  console.log(`incoming request ${request.url}`);
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: () => ({ session: null, prisma: new PrismaClient() }),
  });
};

export { handler as GET, handler as POST };
