import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { DefaultSession, getServerSession } from "next-auth";
import { prisma } from "./db";

export default async function auth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return { user };
}
