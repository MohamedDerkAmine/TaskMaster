import { createTRPCRouter } from "~/server/api/trpc";
import { boardRouter } from "~/server/api/routers/board";
import { columnRouter } from "./routers/column";
import { taskRouter } from "./routers/task";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  board: boardRouter,
  column: columnRouter,
  task: taskRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
