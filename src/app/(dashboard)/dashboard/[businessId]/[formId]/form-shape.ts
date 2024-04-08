import { caFormInterface } from "@/types";
import { boFormInterface } from "@/types/form-types";
import { FilingType } from "@prisma/client";

export const fiFormShape = {
  filingType: "INITIAL" as FilingType,
  legalName: "",
  taxType: "",
  taxId: "",
  taxJurisdiction: "",
};

export const rcFormShape = {
  isForeignPooledInvestmentVehicle: false,
  isRequestingId: false,
  legalName: "",
  alternateNames: [],
  taxType: "",
  taxId: "",
  taxJurisdiction: "",
  jurisdiction: "",
  domesticState: "",
  domesticTribalJurisdiction: "",
  domesticOtherTribe: "",
  foreignFirstState: "",
  foreignTribalJurisdiction: "",
  foreignOtherTribe: "",
  country: "",
  address: "",
  city: "",
  state: "",
  zip: "",
};

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
    image: "",
  },
  identifyingDocument: {
    name: "",
    size: 0,
    type: "",
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
    image: "",
  },
  identifyingDocument: {
    name: "",
    size: 0,
    type: "",
  },
};
