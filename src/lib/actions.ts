"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

const BusinessSchema = z.object({
  name: z.coerce
    .string({
      required_error: "Business name is required",
    })
    .min(3, {
      message: "Business name must be at least 3 characters long",
    }),
  description: z.string(),
  logo: z.string(),
});

export async function createBusiness(business: {
  name: string;
  logo: string;
  description: string;
  creationDate: string;
  entityType: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return {
        message: "Unauthenticated",
      };
    }

    const businessFormData = BusinessSchema.safeParse({
      logo: business.logo,
      name: business.name,
      description: business.description,
    });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return {
        message: "Unauthorized",
      };
    }

    if (!businessFormData.success) {
      return {
        errors: businessFormData.error.flatten().fieldErrors,
      };
    }

    const newBusiness = await prisma.business.create({
      data: {
        logo: businessFormData.data.logo,
        name: businessFormData.data.name,
        description: businessFormData.data.description,
        ownerId: user.id,
      },
    });

    if (!newBusiness) {
      return {
        errors: {
          server: "Failed to create business",
        },
      };
    }

    revalidatePath("/dashboard");
    return {
      business: newBusiness,
      created: true,
    };
  } catch (error) {
    console.log(error);
    return {
      errors: {
        message: "An error occurred",
      },
    };
  }
}

export async function createForm(data: { businessId: string }) {
  const session = await getServerSession(authOptions);

  const { businessId } = data;

  if (!session || !session.user || !session.user.email) {
    return redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return redirect("/");
  }

  if (!businessId) {
    return new Response("Business ID is required", {
      status: 400,
    });
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
  });

  if (!business) {
    return new Response("Business not found", {
      status: 404,
    });
  }

  const formCount = await prisma.form.count({
    where: {
      businessId: business.id,
    },
  });

  const newForm = await prisma.form.create({
    data: {
      businessId: business.id,
      version: formCount + 1,
    },
  });

  revalidatePath(`/dashboard/${businessId}`);
  redirect(`/dashboard/${businessId}/${newForm.id}`);
}
