import { Form, FiForm, RcForm, caForm } from "@prisma/client";

export type iFullFormType = Form & {
  fi: FiForm | null;
} & {
  rc: RcForm | null;
} & {
  ca: caForm[];
};

export type {
  fiFormInterface,
  rcFormInterface,
  caFormInterface,
  boFormInterface,
} from "./form-types";
