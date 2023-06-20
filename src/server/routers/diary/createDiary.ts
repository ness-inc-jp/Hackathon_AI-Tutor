import { TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/src/pages/api/auth/[...nextauth]";
import { prisma } from "@/src/utils/prisma";
import { procedure } from "../../trpc";

export const createDiary = procedure
  .input(
    z.object({
      title: z.string(),
      content: z.string(),
      date: z.date(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    if (!session || !session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    await prisma.diary.create({
      data: {
        title: input.title,
        content: input.content,
        date: input.date,
        authorId: session.user.id,
      },
    });
  });
