import { Form, FiForm, RcForm, caForm } from "@prisma/client";
import { boFormInterface, caFormInterface } from "./form-types";

export type iFullFormType = Form & {
  fi: FiForm | null;
} & {
  rc: RcForm | null;
} & {
  ca: caFormInterface[];
} & {
  bo: boFormInterface[];
};

export type {
  fiFormInterface,
  rcFormInterface,
  caFormInterface,
  boFormInterface,
} from "./form-types";
