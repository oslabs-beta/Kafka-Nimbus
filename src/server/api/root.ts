import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { createVPCRouter } from "./routers/VPCRouter";

import { databaseRouter } from "./routers/databaseRouter";
import { clusterRouter } from "./routers/clusterRouter";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  createVPC: createVPCRouter,
  database: databaseRouter,
  createCluster: clusterRouter

});


// export type definition of API
export type AppRouter = typeof appRouter;
