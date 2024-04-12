"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { getServerSession } from "next-auth";
import { prisma } from "./db";
import { iFormType } from "@/app/(dashboard)/dashboard/[businessId]/[formId]/form";
import { AddressType } from "@prisma/client";

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

    // Remove (formId, id, createdAt and updatedAt) from fi, rc, and ca
    // @ts-expect-error
    delete fi.formId;
    // @ts-expect-error
    delete rc.formId;
    ca.forEach((entry) => {
      // @ts-expect-error
      delete entry.formId;
      // @ts-expect-error
      delete entry.id;
    });
    bo.forEach((entry) => {
      // @ts-expect-error
      delete entry.formId;
      // @ts-expect-error
      delete entry.id;
    });

    // Update the form accordingly
    const updatedForm = await prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        fi: {
          update: { ...fi },
        },
        rc: {
          update: { ...rc },
        },
        ca: {
          deleteMany: {
            formId,
          },
          createMany: {
            data:
              formStep > 1
                ? await Promise.all(
                    ca.map(async (entry) => {
                      const { identification, identifyingDocument } = entry;

                      const createdIdentification =
                        await prisma.identification.upsert({
                          where: {
                            id: identification.id,
                          },
                          update: {
                            ...identification,
                          },
                          create: {
                            ...identification,
                          },
                        });

                      const createdIdentifyingDocument =
                        await prisma.identifyingDocument.upsert({
                          where: {
                            id: identifyingDocument.id,
                          },
                          update: {
                            ...identifyingDocument,
                          },
                          create: {
                            ...identifyingDocument,
                          },
                        });

                      if (entry.hasOwnProperty("identification")) {
                        // @ts-expect-error
                        delete entry?.identification;
                      }

                      if (entry.hasOwnProperty("identifyingDocument")) {
                        // @ts-expect-error
                        delete entry.identifyingDocument;
                      }

                      return {
                        ...entry,
                        addressType: entry.addressType as AddressType,
                        dob: new Date(entry.dob ? entry.dob : 0),
                        identificationId: createdIdentification.id,
                        identifyingDocumentId: createdIdentifyingDocument.id,
                      };
                    }),
                  )
                : [],
          },
        },
        bo: {
          deleteMany: {
            formId,
          },
          createMany: {
            data:
              formStep > 2
                ? await Promise.all(
                    bo.map(async (entry) => {
                      const { identification, identifyingDocument } = entry;

                      const createdIdentification =
                        await prisma.identification.upsert({
                          where: {
                            id: identification.id,
                          },
                          update: {
                            ...identification,
                          },
                          create: {
                            ...identification,
                          },
                        });

                      const createdIdentifyingDocument =
                        await prisma.identifyingDocument.upsert({
                          where: {
                            id: identifyingDocument.id,
                          },
                          update: {
                            ...identifyingDocument,
                          },
                          create: {
                            ...identifyingDocument,
                          },
                        });

                      if (entry.hasOwnProperty("identification")) {
                        // @ts-expect-error
                        delete entry?.identification;
                      }

                      if (entry.hasOwnProperty("identifyingDocument")) {
                        // @ts-expect-error
                        delete entry.identifyingDocument;
                      }

                      return {
                        ...entry,
                        dob: new Date(entry.dob ? entry.dob : 0),
                        identificationId: createdIdentification.id,
                        identifyingDocumentId: createdIdentifyingDocument.id,
                      };
                    }),
                  )
                : [],
          },
        },
      },
      include: {
        fi: true,
        rc: true,
        ca: true,
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
