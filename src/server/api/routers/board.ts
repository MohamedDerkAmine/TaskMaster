import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const boardRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ title: z.string(), description: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.board.create({
        data: {
          title: input.title,
          description: input.description,
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        boardId: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.board.update({
        where: {
          id: input.boardId,
        },
        data: {
          title: input.title,
          description: input.description,
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ boardId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.board.delete({
        where: {
          id: input.boardId,
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.board.findMany();
  }),
});
