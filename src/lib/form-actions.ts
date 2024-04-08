"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { getServerSession } from "next-auth";
import { prisma } from "./db";
import { iFormType } from "@/app/(dashboard)/dashboard/[businessId]/[formId]/form";

export const saveForm = async (
  businessId: string,
  formId: string,
  formStep: number,
  formData: iFormType,
) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return {
        message: "Unauthenticated",
      };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return {
        message: "Unauthorized",
      };
    }

    const form = await prisma.form.findUnique({
      where: {
        id: formId,
        ownerId: user.id,
        businessId: businessId,
      },
      include: {
        fi: true,
      },
    });

    if (!form) {
      throw new Error("Form not found");
    }

    const { fi, rc, ca, bo } = formData;

    // Update the form accordingly
    const updatedForm = await prisma.form.update({
      where: {
        id: formId,
        fi: {
          formId: form.id,
        },
      },
      data: {
        fi: {
          update: { ...fi },
        },
        rc: {
          update: { ...rc },
        },
      },
      include: {
        fi: true,
        rc: true,
      },
    });

    return updatedForm;
  } catch (error) {
    console.error(error);
    return {
      message: "Error",
    };
  }
};
