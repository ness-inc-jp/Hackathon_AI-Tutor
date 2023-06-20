import { router } from "../../trpc";
import { createDiary } from "./createDiary";

export const diaryRouter = router({
  createDiary: createDiary,
});
