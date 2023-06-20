import { router } from "../trpc";
import { diaryRouter } from "./diary";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  diary: diaryRouter,
});

export type AppRouter = typeof appRouter;
