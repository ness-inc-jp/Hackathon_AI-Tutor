import { router } from "../../trpc";
import { updateUser } from "./updateUser";

export const userRouter = router({
  updateUser: updateUser,
});
