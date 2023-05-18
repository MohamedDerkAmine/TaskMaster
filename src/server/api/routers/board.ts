import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const boardRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ title: z.string(), description: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.board.create({
        data: {
          title: input.title,
          description: input.description,
        },
      });

      return ctx.prisma.board.findMany();
    }),
  update: publicProcedure
    .input(
      z.object({
        boardId: z.number().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const board = await ctx.prisma.board.update({
        where: {
          id: input.boardId,
        },
        data: {
          title: input.title,
          description: input.description,
        },
      });

      return { boards: await ctx.prisma.board.findMany(), board };
    }),
  delete: publicProcedure
    .input(z.object({ boardId: z.number().optional() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.board.delete({
        where: {
          id: input.boardId,
        },
      });

      return await ctx.prisma.board.findMany();
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.board.findMany();
  }),
});
