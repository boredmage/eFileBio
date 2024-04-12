import { caFormInterface } from "@/types";
import {
  boFormInterface,
  fiFormInterface,
  rcFormInterface,
} from "@/types/form-types";
import { AddressType } from "@prisma/client";

export const fiFormShape: fiFormInterface = {
  id: "",
  filingType: "INITIAL",
  legalName: "",
  taxType: "",
  taxId: "",
  taxJurisdiction: "",
};

export const rcFormShape: rcFormInterface = {
  id: "",
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
  id: "",
  fincenId: "",
  lastName: "",
  middleName: "",
  firstName: "",
  suffix: "",
  dob: "" as unknown as Date,
  addressType: "" as AddressType,
  country: "",
  state: "",
  address: "",
  city: "",
  zip: "",
  identification: {
    id: "",
    type: "",
    ID: "",
    jurisdiction: "",
    state: "",
    localTribal: "",
    otherTribe: "",
    image: "",
  },
  identifyingDocument: {
    id: "",
    name: "",
    size: 0,
    type: "",
  },
};

export const boFormShape: boFormInterface = {
  id: "",
  isParentGuardianInformation: false,
  fincenId: "",
  isExemptEntity: false,
  lastName: "",
  middleName: "",
  firstName: "",
  suffix: "",
  dob: null,
  country: "",
  state: "",
  address: "",
  city: "",
  zip: "",
  identification: {
    id: "",
    type: "",
    ID: "",
    jurisdiction: "",
    state: "",
    localTribal: "",
    otherTribe: "",
    image: "",
  },
  identifyingDocument: {
    id: "",
    name: "",
    size: 0,
    type: "",
  },
};
