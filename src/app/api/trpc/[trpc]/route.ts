import {
  type FetchCreateContextFnOptions,
  fetchRequestHandler
} from '@trpc/server/adapters/fetch';
import { PrismaClient } from '@prisma/client';
import { prisma } from '~/server/db';
import type { Session } from 'next-auth';
import { env } from '~/env.mjs';
import { createTRPCContext } from '~/server/api/trpc';
import { appRouter } from '~/server/api/root';
import type { NextApiRequest, NextApiResponse } from 'next';

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
