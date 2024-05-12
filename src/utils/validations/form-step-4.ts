import * as Yup from "yup";
import { priorityCountries } from "../constants";

const whenNotExempt = (message: string) =>
  Yup.string().when("isExemptEntity", {
    is: false,
    then: (schema) => schema.required(message),
    otherwise: (schema) => schema.notRequired(),
  });

const formStep4Validation = Yup.array().of(
  Yup.object().shape(
    {
      lastName: Yup.string().required("Last name is required"),
      isExemptEntity: Yup.boolean().notRequired(),

      firstName: whenNotExempt("First name is required"),
      dob: whenNotExempt("Date of birth is required"),
      country: whenNotExempt("Country is required"),
      address: whenNotExempt(
        "Address (number, street, and apt. or suite no.) is required",
      ),
      city: whenNotExempt("City is required"),
      state: Yup.string().when("country", {
        is: (val: string) =>
          priorityCountries.map((c) => c.value).includes(val),
        then: (schema) => schema.required("State is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      zip: whenNotExempt("ZIP code is required"),
      identification: Yup.object().when("isExemptEntity", {
        is: false,
        then: (schema) =>
          schema.shape({
            type: Yup.string().required(
              "Identifying document type is required",
            ),
            ID: Yup.string().required(
              "Identifying document issuing ID number is required",
            ),
            jurisdiction: Yup.string().required("Country is required"),
            state: Yup.string().when(["type", "localTribe"], {
              is: (type: string, tribe: string) =>
                type === "37" || (type === "38" && tribe),
              then: (schema) => schema.required("State is required"),
              otherwise: (schema) => schema.notRequired(),
            }),
            localTribal: Yup.string().when(["type", "state"], {
              is: (type: string, state: string) => type === "38" && !state,
              then: (schema) =>
                schema.required("Required if no state is selected"),
              otherwise: (schema) => schema.notRequired(),
            }),
            otherTribe: Yup.string().when("localTribal", {
              is: (val: string) => val === "Other",
              then: (schema) =>
                schema.required("Other tribe is a required field"),
              otherwise: (schema) => schema.notRequired(),
            }),
            image: Yup.string().required("Identification document is required"),
          }),
      }),
    },
    [["state", "localTribe"]],
  ),
);

export default formStep4Validation;
