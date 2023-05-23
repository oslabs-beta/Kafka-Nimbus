import { createTRPCRouter } from "~/server/api/trpc";
import { createVPCRouter } from "./routers/VPCRouter";
import { clusterRouter } from "./routers/clusterRouter";
import { topicRouter } from "./routers/topicsRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({

  VPC: createVPCRouter,
  Cluster: clusterRouter,
  Topic: topicRouter,

});


// export type definition of API
export type AppRouter = typeof appRouter;
