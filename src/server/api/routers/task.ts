import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        columnId: z.number(),
        subTasks: z.array(z.object({ content: z.string() })).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.task.create({
        data: {
          title: input.title,
          description: input.description,
          columnId: input.columnId,
          subTasks: {
            createMany: {
              data:
                input.subTasks?.map((subTask) => ({
                  content: subTask.content,
                })) || [],
            },
          },
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        taskId: z.number().optional(),
        columnId: z.number().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        subTasksIds: z.array(z.number()).optional(),
        subTasks: z
          .array(z.object({ content: z.string().optional() }))
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const task = await ctx.prisma.task.findUnique({
        where: { id: input.taskId },
        include: { subTasks: true },
      });

      return await ctx.prisma.task.update({
        where: {
          id: input.taskId,
        },
        data: {
          title: input?.title,
          description: input?.description,
          columnId: input?.columnId,
          subTasks: {
            createMany: {
              data:
                input.subTasks ||
                task?.subTasks
                  .filter((subTask) => !input.subTasksIds?.includes(subTask.id))
                  .map((subTask) => ({
                    content: subTask.content,
                    id: subTask.id,
                  })),
            },
            deleteMany: {
              id: {
                in: input?.subTasksIds,
              },
            },
          },
        },
        include: {
          subTasks: true,
        },
      });
    }),

  deleteSubTask: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(
      async ({ input, ctx }) =>
        await ctx.prisma.subTask.delete({ where: { id: input.id } })
    ),

  updateSubTask: publicProcedure
    .input(
      z.object({
        id: z.number(),
        content: z.string(),
        status: z.boolean(),
        taskId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.subTask
        .update({
          where: {
            id: input.id,
          },
          data: {
            content: input.content,
            status: input.status,
          },
        })
        .then(
          async (_data) =>
            await ctx.prisma.task.findUnique({
              where: { id: input.taskId },
              include: { subTasks: true },
            })
        )
        .catch((err) => console.log(err));
    }),

  delete: publicProcedure
    .input(z.object({ taskId: z.number().optional() }))
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
        include: {
          subTasks: true,
        },
      });
    }),
});
