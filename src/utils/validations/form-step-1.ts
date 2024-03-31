import * as Yup from "yup";

const formStep1Validation = Yup.object().shape({
  filingType: Yup.mixed()
    .oneOf(
      ["INITIAL", "CORRECT", "UPDATE", "NEW_EXEMPT"],
      "Filing type is required",
    )
    .required("Filing type is required"),
  legalName: Yup.string().when("filingType", {
    is: (val: string) => val !== "INITIAL",
    then: (schema) => schema.required("Legal name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  taxType: Yup.mixed()
    .oneOf(["ssn", "ein", "foreign"], "Tax type is required")
    .when("filingType", {
      is: (val: string) => val !== "INITIAL",
      then: (schema) => schema.required("Tax type is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  taxId: Yup.string().when(["filingType", "taxType"], {
    is: (filingType: string, taxType: string) =>
      filingType !== "INITIAL" && ["ssn", "ein", "foreign"].includes(taxType),
    then: (schema) =>
      schema
        .required("Tax ID is required")
        .test("len", "Must be exactly 9 characters", (val: any, context) => {
          if (["ssn", "ein"].includes(context.parent.taxType)) {
            return val && val.split("-").join("").length === 9;
          }
          return true;
        }),
    otherwise: (schema) => schema.notRequired(),
  }),
  taxJurisdiction: Yup.string().when("taxType", {
    is: (val: string) => val === "foreign",
    then: (schema) => schema.required("Country is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export default formStep1Validation;
