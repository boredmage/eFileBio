import {
  FiForm,
  Identification,
  IdentifyingDocument,
  RcForm,
  boForm,
  caForm,
} from "@prisma/client";

type OmitData = "createdAt" | "updatedAt" | "formId";
type OmitMultiple<T, K extends keyof T> = Omit<T, K>;

export type fiFormInterface = OmitMultiple<FiForm, OmitData>;

export type rcFormInterface = OmitMultiple<RcForm, OmitData>;

export type caFormInterface = OmitMultiple<
  caForm & {
    identification: Identification;
    identifyingDocument: IdentifyingDocument;
  },
  OmitData | "identificationId" | "identifyingDocumentId"
>;
export type boFormInterface = OmitMultiple<
  boForm & {
    identification: Identification | null;
    identifyingDocument: IdentifyingDocument | null;
  },
  OmitData | "identificationId" | "identifyingDocumentId"
>;
