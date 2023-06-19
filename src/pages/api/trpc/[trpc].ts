import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "@/src/server/routers/_app";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
