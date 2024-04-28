import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: async (params: { session: Session; token: JWT }) => {
      const { session } = params;

      const dbUser = await prisma.user.findUnique({
        where: { email: session.user?.email ?? undefined },
        select: { role: true },
      });

      if (session && session.user && dbUser?.role) {
        session.user = {
          ...session.user,
          role: dbUser?.role,
        };
      }

      return Promise.resolve(session);
    },
  },
};
