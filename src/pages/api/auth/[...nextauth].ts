import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client/extension";
import NextAuth from "next-auth";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [

  ],
};

export default NextAuth(authOptions);