import * as Yup from "yup";

const businessCreationValidation = Yup.object().shape({
  businessName: Yup.string().required("Business name is required"),
  businessLogo: Yup.string().notRequired(),
  businessDescription: Yup.string().notRequired(),
  businessCreationDate: Yup.date().required(
    "Business creation date is required",
  ),
  businessEntityType: Yup.string().required("Business entity type is required"),
});

export default businessCreationValidation;
