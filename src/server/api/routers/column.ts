import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const columnRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ title: z.string(), boardId: z.number().optional() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.column.create({
        data: {
          title: input.title,
          boardId: input.boardId,
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        columnId: z.number(),
        title: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.column.update({
        where: {
          id: input.columnId,
        },
        data: {
          title: input.title,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ columnId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.column.delete({
        where: {
          id: input.columnId,
        },
      });
    }),
  getAll: publicProcedure
    .input(z.object({ boardId: z.number().optional() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.column.findMany({
        where: {
          boardId: input.boardId,
        },
        include: {
          tasks: {
            include: {
              subTasks: true,
            },
          },
        },
      });
    }),
});
