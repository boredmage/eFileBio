export interface fiFormInterface {
  filingType: string;
  legalName: string;
  taxType: string;
  taxId: string;
  taxJurisdiction: string;
}

export interface rcFormInterface {
  isForeignPooledInvestmentVehicle: boolean;
  isRequestingId: boolean;
  legalName: string;
  alternateNames: string[];
  taxType: string;
  taxId: string;
  taxJurisdiction: string;
  jurisdiction: string;
  domesticState: string;
  domesticTribalJurisdiction: string;
  domesticOtherTribe: string;
  foreignFirstState: string;
  foreignTribalJurisdiction: string;
  foreignOtherTribe: string;
  country: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface caFormInterface {
  fincenId: string;
  lastName: string;
  middleName: string;
  firstName: string;
  suffix: string;
  dob: string;
  addressType: string;
  country: string;
  state: string;
  address: string;
  city: string;
  zip: string;
  identification: {
    type: string;
    id: string;
    jurisdiction: string;
    state: string;
    localTribal: string;
    otherTribe: string;
  };
}

export interface boFormInterface extends Omit<caFormInterface, "addressType"> {
  isParentGuardianInformation: boolean;
  isExemptEntity: boolean;
}
