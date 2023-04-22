import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        columnId: z.number(),
        subTasks: z
          .array(z.object({ content: z.string(), status: z.boolean() }))
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.task.create({
        data: {
          title: input.title,
          description: input.description,
          columnId: input.columnId,
          subTasks: input.subTasks,
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        taskId: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        subTasks: z
          .array(z.object({ content: z.string(), status: z.boolean() }))
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.task.update({
        where: {
          id: input.taskId,
        },
        data: {
          title: input.title,
          description: input.description,
          subTasks: input.subTasks,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ taskId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.task.delete({
        where: {
          id: input.taskId,
        },
      });
    }),
  getAll: publicProcedure
    .input(z.object({ columnId: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.task.findMany({
        where: {
          columnId: input.columnId,
        },
      });
    }),
});
