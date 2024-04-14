import { Country, State } from "country-state-city";
import { foreignStates } from "./foreignStates";
import { domesticStates } from "./domesticStates";
import { tribalJurisdiction } from "./tribalJurisdiction";

const priorityCountries = [
  { value: "US", label: "United States of America" },
  { value: "AS", label: "American Samoa" },
  { value: "GU", label: "Guam" },
  { value: "MH", label: "Marshall Islands" },
  { value: "FM", label: "Micronesia, Federated States" },
  { value: "MP", label: "Northern Mariana Islands" },
  { value: "PW", label: "Palau" },
  { value: "PR", label: "Puerto Rico" },
  { value: "VI", label: "U.S. Virgin Islands" },
];

const countries = Country.getAllCountries().map((country) => ({
  value: country.isoCode,
  label: country.name,
}));

const foreignCountries = countries.filter(
  (country) =>
    !priorityCountries.some((pCountry) => pCountry.value === country.value),
);

const sortedCountries = [...priorityCountries, ...foreignCountries];

// const usStates = State.getStatesOfCountry("US").map((state) => ({
//   value: state.isoCode,
//   label: state.name,
// }));

const identifyingDocumentTypes = [
  { value: "37", label: "State issued driver's license" },
  { value: "38", label: "State/local/tribe-issued ID" },
  { value: "39", label: "U.S. passport" },
  { value: "40", label: "Foreign passport" },
];

const taxIdentificationTypes = [
  { label: "EIN", value: "ein" },
  { label: "SSN/ITIN", value: "ssn" },
  { label: "Foreign", value: "foreign" },
];

const businessEntityTypes = [
  {
    label: "Securities reporting issuer",
    value: "Securities reporting issuer",
  },
  { label: "Governmental authority", value: "Governmental authority" },
  { label: "Bank", value: "Bank" },
  { label: "Credit union", value: "Credit union" },
  {
    label: "Depository institution holding company",
    value: "Depository institution holding company",
  },
  { label: "Money services business", value: "Money services business" },
  {
    label: "Broker or dealer in securities",
    value: "Broker or dealer in securities",
  },
  {
    label: "Securities exchange or clearing agency",
    value: "Securities exchange or clearing agency",
  },
  {
    label: "Other Exchange Act registered entity",
    value: "Other Exchange Act registered entity",
  },
  {
    label: "Investment company or investment adviser",
    value: "Investment company or investment adviser",
  },
  {
    label: "Venture capital fund adviser",
    value: "Venture capital fund adviser",
  },
  { label: "Insurance company", value: "Insurance company" },
  {
    label: "State-licensed insurance producer",
    value: "State-licensed insurance producer",
  },
  {
    label: "Commodity Exchange Act registered entity",
    value: "Commodity Exchange Act registered entity",
  },
  { label: "Accounting firm", value: "Accounting firm" },
  { label: "Public utility", value: "Public utility" },
  { label: "Financial market utility", value: "Financial market utility" },
  { label: "Pooled investment vehicle", value: "Pooled investment vehicle" },
  { label: "Tax-exempt entity", value: "Tax-exempt entity" },
  {
    label: "Entity assisting a tax-exempt entity",
    value: "Entity assisting a tax-exempt entity",
  },
  { label: "Large operating company", value: "Large operating company" },
  {
    label: "Subsidiary of certain exempt entities",
    value: "Subsidiary of certain exempt entities",
  },
  { label: "Inactive entity", value: "Inactive entity" },
  { label: "Other", value: "other" },
];

const chipColor = {
  DRAFT: "warning",
  INREVIEW: "secondary",
  SUBMITTED: "primary",
  APPROVED: "success",
  REJECTED: "danger",
} as const;

export {
  // usStates,
  foreignStates,
  domesticStates,
  sortedCountries,
  foreignCountries,
  priorityCountries,
  tribalJurisdiction,
  businessEntityTypes,
  taxIdentificationTypes,
  identifyingDocumentTypes,
  chipColor,
};
