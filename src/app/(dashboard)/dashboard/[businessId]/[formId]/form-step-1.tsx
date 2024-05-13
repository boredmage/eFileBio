"use client";

import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import RadioCheckbox from "@/components/radio-checkbox";
import { foreignCountries, taxIdentificationTypes } from "@/utils/constants";
import {
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { FormikProps } from "formik";
import { useEffect } from "react";
import { iFormType } from "./form";
import TaxIdFormInput from "@/components/taxId-form-input";

const FormStep1 = ({
  formData,
  datePrepared,
  isPreview,
}: {
  formData: FormikProps<iFormType>;
  datePrepared: Date;
  isPreview?: boolean;
}) => {
  const { values, touched, errors, getFieldProps, setFieldValue, handleBlur } =
    formData;
  const { fi: fiValue } = values;
  const { fi: fiTouched } = touched;
  const { fi: fiError } = errors;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const resetValueOnDiff = (field: keyof typeof fiValue) => {
    setFieldValue(`fi[${field}]`, "");
    formData.setFieldError(`fi[${field}]`, "");
    formData.setFieldTouched(`fi[${field}]`, false);
  };

  // useEffect(() => {
  //   if (["INITIAL", "NEW_EXEMPT"].includes(fiValue.filingType)) {
  //     ["legalName", "taxType", "taxId", "taxJurisdiction"].forEach((field) => {
  //       resetValueOnDiff(field as keyof typeof fiValue);
  //       formData.setFieldTouched(`fi[${field}]`, false);
  //       formData.setFieldError(`fi[${field}]`, "");
  //     });
  //   }
  //   if (fiValue.filingType === "NEW_EXEMPT") {
  //     formData.setFieldValue("fi.filingType", "NEW_EXEMPT");
  //   }
  // }, [fiValue.filingType]);

  return (
    <>
      <form onSubmit={formData.handleSubmit}>
        <div className="space-y-6 py-6">
          <div>
            <h2 className="text-xl font-semibold">Filing Information</h2>
            <p className="text-sm">
              Excepteur sint occaecat cupidatat non proident.
            </p>
          </div>
          <Divider className="bg-[#F5F5F5]" />
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center lg:gap-0">
            <h2 className="font-semibold">
              Type of filing:
              <span className="text-red-500">*</span>
            </h2>
            <RadioCheckbox
              isReadOnly={isPreview}
              name="fi.filingType"
              values={[
                { label: "a. Initial report", value: "INITIAL" },
                { label: "b. Correct prior report", value: "CORRECT" },
                { label: "c. Update prior report", value: "UPDATE" },
                { label: "d. Newly exempt entity", value: "NEW_EXEMPT" },
              ]}
              selectedValue={fiValue.filingType}
              setFieldValue={(field, value) => {
                if (["INITIAL", "NEW_EXEMPT"].includes(value)) {
                  ["legalName", "taxType", "taxId", "taxJurisdiction"].forEach(
                    (field) => {
                      resetValueOnDiff(field as keyof typeof fiValue);
                      formData.setFieldTouched(`fi[${field}]`, false);
                      formData.setFieldError(`fi[${field}]`, "");
                    },
                  );
                }
                if (value === "INITIAL") onOpen();
                return formData.setFieldValue(field, value);
              }}
              onBlur={formData.handleBlur}
              isInvalid={fiTouched?.filingType && !!fiError?.filingType}
              errorMessage={fiTouched?.filingType && fiError?.filingType}
            />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <FormInput
              name="datePrepared"
              label="Date prepared (auto filled)"
              value={datePrepared
                .toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })
                .split("/")
                .join(" / ")}
              isReadOnly
            />
          </div>
        </div>
        {fiValue.filingType !== "INITIAL" && fiValue.filingType && (
          <>
            <Divider className="bg-[#F5F5F5]" />
            <div className="space-y-6 py-6">
              <h2 className="font-semibold">
                Reporting Company information associated with most recent
                report, if any:
              </h2>
              <div className="grid gap-6 lg:grid-cols-2">
                <FormInput
                  label="Legal Name"
                  isRequired
                  {...getFieldProps("fi.legalName")}
                  isReadOnly={isPreview}
                  isInvalid={fiTouched?.legalName && !!fiError?.legalName}
                  errorMessage={fiTouched?.legalName && fiError?.legalName}
                />
                <FormSelect
                  listContent={taxIdentificationTypes}
                  label="Tax Identification type"
                  name="fi.taxType"
                  placeholder="Select an ID type"
                  selectedKey={fiValue.taxType}
                  setFieldValue={(field, value) => {
                    if (value !== "foreign") {
                      resetValueOnDiff("taxJurisdiction");
                    }
                    resetValueOnDiff("taxId");
                    return setFieldValue(field, value);
                  }}
                  onBlur={handleBlur}
                  isReadOnly={isPreview}
                  isInvalid={fiTouched?.taxType && !!fiError?.taxType}
                  errorMessage={fiTouched?.taxType && fiError?.taxType}
                  isRequired
                />
                <TaxIdFormInput
                  name="fi.taxId"
                  onBlur={handleBlur}
                  taxType={fiValue.taxType}
                  value={fiValue.taxId}
                  setFieldValue={setFieldValue}
                  isDisabled={!fiValue.taxType}
                  isReadOnly={isPreview}
                  isInvalid={fiTouched?.taxId && !!fiError?.taxId}
                  errorMessage={fiTouched?.taxId && fiError?.taxId}
                  isRequired
                />
                <FormSelect
                  listContent={foreignCountries}
                  label="Country/Jurisdiction (if foreign tax ID only)"
                  name="fi.taxJurisdiction"
                  placeholder="Select a country"
                  selectedKey={fiValue.taxJurisdiction}
                  setFieldValue={setFieldValue}
                  onBlur={handleBlur}
                  isReadOnly={isPreview}
                  isInvalid={
                    fiTouched?.taxJurisdiction && !!fiError?.taxJurisdiction
                  }
                  errorMessage={
                    fiTouched?.taxJurisdiction && fiError?.taxJurisdiction
                  }
                  isDisabled={fiValue.taxType !== "foreign"}
                  isRequired={fiValue.taxType === "foreign"}
                />
              </div>
            </div>
          </>
        )}
      </form>
      <InitialFillingTypeWarning isOpen={isOpen} onClose={onClose} />
    </>
  );
};

const InitialFillingTypeWarning = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-danger-500">
              Warning!!
            </ModalHeader>
            <ModalBody>
              <p>
                You have selected <b>Initial report</b> as the type of filing.{" "}
                <b>
                  This will archive all previous reports with Initial report
                </b>{" "}
                filling type when you save this form.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default FormStep1;
