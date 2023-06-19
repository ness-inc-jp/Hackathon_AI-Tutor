import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const { req, res } = opts;

  return {
    req,
    res,
  };
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
