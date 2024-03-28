import { caFormInterface } from "@/types";
import { boFormInterface } from "@/types/form-types";

export const caFormShape: caFormInterface = {
  fincenId: "",
  lastName: "",
  middleName: "",
  firstName: "",
  suffix: "",
  dob: "",
  addressType: "",
  country: "",
  state: "",
  address: "",
  city: "",
  zip: "",
  identification: {
    type: "",
    id: "",
    jurisdiction: "",
    state: "",
    localTribal: "",
    otherTribe: "",
  },
};

export const boFormShape: boFormInterface = {
  isParentGuardianInformation: false,
  fincenId: "",
  isExemptEntity: false,
  lastName: "",
  middleName: "",
  firstName: "",
  suffix: "",
  dob: "",
  country: "",
  state: "",
  address: "",
  city: "",
  zip: "",
  identification: {
    type: "",
    id: "",
    jurisdiction: "",
    state: "",
    localTribal: "",
    otherTribe: "",
  },
};
