import NextAuth from "next-auth/next";
import { authOptions } from "@/src/server/auth";

export default NextAuth(authOptions);
