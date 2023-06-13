import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";

const authOptions: AuthOptions = {
  providers: [],
};

export default NextAuth(authOptions);
