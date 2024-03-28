import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth-options";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const formId = searchParams.get("formId");
  const businessId = searchParams.get("businessId");

  if (!session || !session.user || !session.user.email) {
    return redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return redirect("/");
  }

  if (!businessId || !formId) {
    return new Response("Business ID is required", {
      status: 400,
    });
  }

  const form = await prisma.form.findUnique({
    where: { id: formId, businessId },
    include: {
      business: {
        select: {
          logo: true,
        },
      },
    },
  });

  if (!form) {
    return new Response("Business not found", {
      status: 404,
    });
  }

  return new Response(JSON.stringify(form), {
    status: 200,
  });
}
