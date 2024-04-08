import { Form, FiForm, RcForm } from "@prisma/client";

export type iFullFormType = Form & {
  fi: FiForm | null;
} & {
  rc: RcForm | null;
};

export type {
  fiFormInterface,
  rcFormInterface,
  caFormInterface,
  boFormInterface,
} from "./form-types";
