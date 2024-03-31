import * as Yup from "yup";
import { priorityCountries } from "../constants";

const formStep2Validation = Yup.object().shape(
  {
    legalName: Yup.string().required("Company legal name is required"),
    taxType: Yup.mixed()
      .oneOf(["ssn", "ein", "foreign"], "Tax ID is required")
      .required("Tax type is required"),
    taxId: Yup.string()
      .required("Tax ID is required")
      .test("len", "Must be exactly 9 characters", (val: any, context) => {
        if (["ssn", "ein"].includes(context.parent.taxType)) {
          return val && val.split("-").join("").length === 9;
        }
        return true;
      }),
    taxJurisdiction: Yup.string().when("taxType", {
      is: (val: string) => val === "foreign",
      then: (schema) =>
        schema.required(
          "Country/Jurisdiction (if foreign tax ID only) is a required field",
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    jurisdiction: Yup.string().required("Country/Jurisdiction is required"),
    domesticState: Yup.string().when(
      ["domesticTribalJurisdiction", "jurisdiction"],
      {
        is: (val: string, jur: string) =>
          !val && priorityCountries.map((c) => c.value).includes(jur),
        then: (schema) => schema.required("Other state is a required field"),
        otherwise: (schema) => schema.notRequired(),
      },
    ),
    domesticTribalJurisdiction: Yup.string().when(
      ["domesticState", "jurisdiction"],
      {
        is: (val: string, jur: string) => !val && jur === "US",
        then: (schema) => schema.required("Required if no state is selected"),
        otherwise: (schema) => schema.notRequired(),
      },
    ),
    domesticOtherTribe: Yup.string().when("domesticTribalJurisdiction", {
      is: (val: string) => val === "Other",
      then: (schema) => schema.required("Other tribe is a required field"),
      otherwise: (schema) => schema.notRequired(),
    }),
    foreignFirstState: Yup.string().when(
      ["foreignTribalJurisdiction", "jurisdiction"],
      {
        is: (val: string, jur: string) =>
          !val && !priorityCountries.map((c) => c.value).includes(jur),
        then: (schema) => schema.required("Other state is a required field"),
        otherwise: (schema) => schema.notRequired(),
      },
    ),
    foreignTribalJurisdiction: Yup.string().when(
      ["foreignFirstState", "jurisdiction"],
      {
        is: (val: string, jur: string) =>
          !val && !priorityCountries.map((c) => c.value).includes(jur),
        then: (schema) => schema.required("Required if no state is selected"),
        otherwise: (schema) => schema.notRequired(),
      },
    ),

    foreignOtherTribe: Yup.string().when("foreignTribalJurisdiction", {
      is: (val: string) => val === "Other",
      then: (schema) => schema.required("Other tribe is a required field"),
      otherwise: (schema) => schema.notRequired(),
    }),
    country: Yup.string().required("Country is required"),
    address: Yup.string().required(
      "Address (number, street, and apt. or suite no.) is required",
    ),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zip: Yup.string().required("ZIP code is required"),
  },
  [
    ["foreignFirstState", "foreignTribalJurisdiction"],
    ["domesticState", "domesticTribalJurisdiction"],
  ],
);

export default formStep2Validation;
