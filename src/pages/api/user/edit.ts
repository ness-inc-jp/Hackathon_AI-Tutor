import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { prisma } from "@/src/utils/prisma";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: "Missing name" });
    return;
  }

  const user = await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name: name,
    },
  });

  res.status(200).json({ user });
}
