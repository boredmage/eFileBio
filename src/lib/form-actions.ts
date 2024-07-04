"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { getServerSession } from "next-auth";
import { prisma } from "./db";
import {
  AddressType,
  FiForm,
  FillingStatus,
  Identification,
  IdentifyingDocument,
  RcForm,
  boForm,
  caForm,
} from "@prisma/client";
import { revalidatePath } from "next/cache";

interface ID {
  identification: Identification;
  identifyingDocument: IdentifyingDocument;
}

type iIdentification = Partial<
  Pick<ID, "identification" | "identifyingDocument">
>;
type iFormExclusives = "createdAt" | "updatedAt" | "formId";
type iFormIDExclusives =
  | iFormExclusives
  | "identificationId"
  | "identifyingDocumentId";

type iFiEntry = Omit<FiForm, iFormExclusives> & Partial<Pick<FiForm, "formId">>;
type iRcEntry = Omit<RcForm, iFormExclusives> & Partial<Pick<RcForm, "formId">>;
type iCaEntry = Omit<caForm, iFormIDExclusives> &
  Partial<Pick<caForm, "formId">> &
  iIdentification;
type iBoEntry = Omit<boForm, iFormIDExclusives> &
  Partial<Pick<boForm, "formId">> & {
    identification: Identification | null;
    identifyingDocument: IdentifyingDocument | null;
  };

export const saveForm = async (
  businessId: string,
  formId: string,
  formStep: number,
  formData: {
    fi: iFiEntry;
    rc: iRcEntry;
    ca: iCaEntry[];
    bo: iBoEntry[];
  },
  revalidateForm?: boolean,
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
    const { formId: fiFormId, id: fiId, ...restFiData } = fi;
    const { formId: rcFormId, id: rcId, ...restRcData } = rc;

    if (formStep === 0 && fi.filingType === "INITIAL") {
      // Archive all forms for this business where the filing type is INITIAL and id is not the current form
      await prisma.form.updateMany({
        where: {
          businessId,
          status: "DRAFT",
          fi: {
            filingType: "INITIAL",
          },
          id: {
            not: formId,
          },
        },
        data: {
          status: "ARCHIVED",
        },
      });
    }

    // Update the form accordingly
    const updatedForm = await prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        updatedAt: new Date(),
        fi: {
          upsert: {
            create: { ...restFiData },
            update: { ...restFiData, updatedAt: new Date() },
          },
        },
        rc:
          formStep > 0
            ? {
                upsert: {
                  create: { ...restRcData },
                  update: { ...restRcData, updatedAt: new Date() },
                },
              }
            : {},
        ca: {
          deleteMany: {
            formId,
          },
          createMany: {
            data:
              formStep > 1
                ? await Promise.all(
                    ca.map(async (entry) => {
                      const {
                        formId,
                        id: caEntryId,
                        identification,
                        identifyingDocument,
                        ...caEntryData
                      } = entry;

                      let createdIdentification, createdIdentifyingDocument;

                      if (identification) {
                        const { id: identificationId, ...identificationData } =
                          identification;
                        createdIdentification = identificationId
                          ? await prisma.identification.update({
                              where: { id: identificationId },
                              data: { ...identificationData },
                            })
                          : await prisma.identification.create({
                              data: { ...identificationData },
                            });
                      }

                      if (identifyingDocument) {
                        const {
                          id: identifyingDocumentId,
                          ...identifyingDocumentData
                        } = identifyingDocument;

                        createdIdentifyingDocument = identifyingDocumentId
                          ? await prisma.identifyingDocument.update({
                              where: { id: identifyingDocumentId },
                              data: { ...identifyingDocumentData },
                            })
                          : await prisma.identifyingDocument.create({
                              data: { ...identifyingDocumentData },
                            });
                      }

                      return {
                        ...caEntryData,
                        addressType: entry.addressType as AddressType,
                        dob: new Date(entry.dob ? entry.dob : 0),
                        identificationId: createdIdentification!.id,
                        identifyingDocumentId: createdIdentifyingDocument!.id,
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
                      const {
                        formId,
                        id: boEntryId,
                        identification,
                        identifyingDocument,
                        isExemptEntity,
                        ...boEntryData
                      } = entry;

                      let createdIdentification, createdIdentifyingDocument;

                      if (!isExemptEntity && identification) {
                        const { id: identificationId, ...identificationData } =
                          identification;
                        createdIdentification = identificationId
                          ? await prisma.identification.update({
                              where: { id: identificationId },
                              data: { ...identificationData },
                            })
                          : await prisma.identification.create({
                              data: { ...identificationData },
                            });
                      }

                      if (!isExemptEntity && identifyingDocument) {
                        const {
                          id: identifyingDocumentId,
                          ...identifyingDocumentData
                        } = identifyingDocument;
                        createdIdentifyingDocument = identifyingDocumentId
                          ? await prisma.identifyingDocument.update({
                              where: { id: identifyingDocumentId },
                              data: { ...identifyingDocumentData },
                            })
                          : await prisma.identifyingDocument.create({
                              data: { ...identifyingDocumentData },
                            });
                      }

                      return {
                        ...boEntryData,
                        isExemptEntity,
                        dob: new Date(entry.dob ? entry.dob : 0),
                        ...(!isExemptEntity && {
                          identificationId:
                            createdIdentification && createdIdentification.id,
                          identifyingDocumentId:
                            createdIdentifyingDocument &&
                            createdIdentifyingDocument.id,
                        }),
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

    if ((formStep === 0 && fi.filingType === "INITIAL") || revalidateForm) {
      revalidatePath(`/forms`);
      revalidatePath(`/forms/${formId}`);
      revalidatePath(`/dashboard/${businessId}`);
    }

    return updatedForm;
  } catch (error) {
    console.error(error);
    return {
      message: "Error",
    };
  }
};

export const serverUpdateFormStatus = async (
  formId: string,
  status: FillingStatus,
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
      },
    });

    if (!form) {
      throw new Error("Form not found");
    }

    const updatedForm = await prisma.form.update({
      where: {
        id: formId,
      },
      data: {
        status,
      },
    });

    revalidatePath(`/forms/${formId}`);
    revalidatePath(`/dashboard/${form.businessId}`);
    revalidatePath(`/dashboard/${form.businessId}/${formId}`);
    return updatedForm;
  } catch (error) {
    console.error(error);
    return {
      message: "Error",
    };
  }
};
