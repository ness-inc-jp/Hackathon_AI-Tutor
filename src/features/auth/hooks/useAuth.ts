import { signIn } from "next-auth/react";

export const useAuth = () => {
  const loginWithGoogle = async () => {
    await signIn("google", { callbackUrl: "/home" });
  };

  return {
    loginWithGoogle,
  };
};
