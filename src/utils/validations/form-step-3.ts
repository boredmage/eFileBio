import * as Yup from "yup";
import { priorityCountries } from "../constants";

const formStep3Validation = Yup.array().of(
  Yup.object().shape(
    {
      lastName: Yup.string().required("Last name is required"),
      firstName: Yup.string().required("First name is required"),
      dob: Yup.string().required("Date of birth is required"),
      addressType: Yup.string().required("Address type is required"),
      country: Yup.string().required("Country is required"),
      address: Yup.string().required(
        "Address (number, street, and apt. or suite no.) is required",
      ),
      city: Yup.string().required("City is required"),
      state: Yup.string().when("country", {
        is: (val: string) =>
          priorityCountries.map((c) => c.value).includes(val),
        then: (schema) => schema.required("State is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      zip: Yup.string().required("ZIP code is required"),
      identification: Yup.object().shape({
        type: Yup.string().required("Identifying document type is required"),
        id: Yup.string().required(
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
          then: (schema) => schema.required("Required if no state is selected"),
          otherwise: (schema) => schema.notRequired(),
        }),
        otherTribe: Yup.string().when("localTribal", {
          is: (val: string) => val === "Other",
          then: (schema) => schema.required("Other tribe is a required field"),
          otherwise: (schema) => schema.notRequired(),
        }),
      }),
    },
    [["state", "localTribe"]],
  ),
);

export default formStep3Validation;
