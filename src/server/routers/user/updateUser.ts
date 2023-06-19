import { TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/src/pages/api/auth/[...nextauth]";
import { prisma } from "@/src/utils/prisma";
import { procedure } from "../../trpc";

export const updateUser = procedure
  .input(
    z.object({
      name: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    if (!session || !session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: input.name,
      },
    });

    return updatedUser;
  });
