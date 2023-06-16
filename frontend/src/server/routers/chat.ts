import { z } from "zod";
import { procedure, router } from "../trpc";

export const chatRouter = router({
  createChat: procedure
    .input(
      z.object({
        message: z.string(),
      }),
    )
    .mutation((opts) => {
      return {
        message: `hello ${opts.input.message}`,
      };
    }),
});
