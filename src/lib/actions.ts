"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import {
  FiForm,
  FilingType,
  Identification,
  IdentifyingDocument,
  RcForm,
} from "@prisma/client";
import { saveForm } from "./form-actions";

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
  entityType: z.string(),
  creationDate: z.date(),
});

export async function createBusiness(business: {
  name: string;
  logo: string;
  description: string;
  creationDate: Date;
  entityType: string;
}) {
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
      entityType: business.entityType,
      creationDate: business.creationDate,
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
        entityType: business.entityType,
        name: businessFormData.data.name,
        logo: businessFormData.data.logo,
        creationDate: business.creationDate,
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
  try {
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
        ownerId: user.id,
        version: formCount + 1,
        businessId: business.id,
      },
    });
    revalidatePath(`/dashboard/${businessId}`);
    return newForm;
  } catch (error) {
    console.log(error);
  }
}

export async function duplicateForm(data: {
  formId: string;
  fillingType?: FilingType;
}) {
  try {
    const session = await getServerSession(authOptions);

    const { formId, fillingType } = data;

    if (!session || !session.user || !session.user.email) {
      return redirect("/");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return redirect("/");
    }

    if (!formId) {
      return new Response("Form ID is required", {
        status: 400,
      });
    }

    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        fi: true,
        rc: true,
        ca: {
          include: {
            identification: true,
            identifyingDocument: true,
          },
        },
        bo: {
          include: {
            identification: true,
            identifyingDocument: true,
          },
        },
      },
    });

    if (!form) {
      return new Response("Form not found", {
        status: 404,
      });
    }

    const { fi, rc, ca, bo } = form;
    const newForm = await createForm({ businessId: form.businessId });

    if (!newForm) {
      return new Response("Failed to duplicate form", {
        status: 500,
      });
    }

    console.log("FORM TO DUPLICATE", form);

    const formData = {
      fi: (fi || {}) as FiForm,
      rc: (rc || {}) as RcForm,
      ca: ca.map((c) => {
        const {
          identificationId,
          identifyingDocumentId,
          identification,
          identifyingDocument,
          ...rest
        } = c;
        const { id, ...identificationData } = identification;
        const { id: docId, ...documentData } = identifyingDocument;
        return {
          ...rest,
          identification: {
            id: "",
            ...identificationData,
          },
          identifyingDocument: {
            id: "",
            ...documentData,
          },
        };
      }),
      bo: bo.map((b) => {
        const {
          identificationId,
          identifyingDocumentId,
          identification,
          identifyingDocument,
          ...rest
        } = b;
        const { ...identificationData } =
          identification || ({} as Identification);
        const { ...documentData } =
          identifyingDocument || ({} as IdentifyingDocument);
        return {
          ...rest,
          identification: {
            ...identificationData,
            id: "",
          },
          identifyingDocument: {
            ...documentData,
            id: "",
          },
        };
      }),
    };

    if (newForm && "id" in newForm) {
      await saveForm(form.businessId, newForm.id, 4, formData, true);
    }
  } catch (error) {
    console.log(error);
  }
}
