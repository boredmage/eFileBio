"use client";

import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import RadioCheckbox from "@/components/radio-checkbox";
import { foreignCountries, taxIdentificationTypes } from "@/utils/constants";
import { Divider } from "@nextui-org/react";
import { FormikProps } from "formik";
import { useEffect } from "react";
import { iFormType } from "./form";

const FormStep1 = ({
  formData,
  datePrepared,
}: {
  formData: FormikProps<iFormType>;
  datePrepared: Date;
}) => {
  const { values, touched, errors, getFieldProps, setFieldValue, handleBlur } =
    formData;
  const { fi: fiValue } = values;
  const { fi: fiTouched } = touched;
  const { fi: fiError } = errors;

  const resetValueOnDiff = (field: keyof typeof fiValue) => {
    setFieldValue(`fi[${field}]`, "");
  };

  useEffect(() => {
    if (fiValue.taxType !== "foreign") {
      resetValueOnDiff("taxJurisdiction");
      formData.setFieldError("fi.taxJurisdiction", "");
      formData.setFieldTouched("fi.taxJurisdiction", false);
    }
  }, [fiValue.taxType]);

  useEffect(() => {
    if (["INITIAL", "NEW_EXEMPT"].includes(fiValue.filingType)) {
      ["legalName", "taxType", "taxId", "taxJurisdiction"].forEach((field) => {
        resetValueOnDiff(field as keyof typeof fiValue);
        formData.setFieldTouched(`fi[${field}]`, false);
        formData.setFieldError(`fi[${field}]`, "");
      });
    }
    // if (fiValue.filingType === "NEW_EXEMPT") {
    //   formData.setFieldValue("fi.filingType", "NEW_EXEMPT");
    // }
  }, [fiValue.filingType]);

  return (
    <form onSubmit={formData.handleSubmit}>
      {/* <div className="grid grid-cols-2 gap-6 py-6">
        <FormDate
          label={<span className="text-sm">Business Creation Date</span>}
          placeholder={`01/01/${new Date().getFullYear()}`}
          labelPlacement="outside"
          size="lg"
          startContent={<CalendarDays />}
          radius="sm"
        />
        <FormSelect
          listContent={[]}
          label="Entity Type"
          placeholder="Securities reporting issuer"
          startContent={<BookAudio />}
        />
      </div> */}

      <div className="space-y-6 py-6">
        <div>
          <h2 className="text-xl font-semibold">Filing Information</h2>
          <p className="text-sm">
            Excepteur sint occaecat cupidatat non proident.
          </p>
        </div>
        <Divider className="bg-[#F5F5F5]" />
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">
            Type of filing:
            <span className="text-red-500">*</span>
          </h2>
          <RadioCheckbox
            name="fi.filingType"
            values={[
              { label: "a. Initial report", value: "INITIAL" },
              { label: "b. Correct prior report", value: "CORRECT" },
              { label: "c. Update prior report", value: "UPDATE" },
              { label: "d. Newly exempt entity", value: "NEW_EXEMPT" },
            ]}
            selectedValue={fiValue.filingType}
            setFieldValue={formData.setFieldValue}
            onBlur={formData.handleBlur}
            isInvalid={fiTouched?.filingType && !!fiError?.filingType}
            errorMessage={fiTouched?.filingType && fiError?.filingType}
          />
        </div>
        <div className="grid grid-cols-3 gap-6">
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
            disabled
          />
        </div>
      </div>
      {fiValue.filingType !== "INITIAL" && fiValue.filingType && (
        <>
          <Divider className="bg-[#F5F5F5]" />
          <div className="space-y-6 py-6">
            <h2 className="font-semibold">
              Reporting Company information associated with most recent report,
              if any:
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <FormInput
                label="Legal Name"
                isRequired
                {...getFieldProps("fi.legalName")}
                isInvalid={fiTouched?.legalName && !!fiError?.legalName}
                errorMessage={fiTouched?.legalName && fiError?.legalName}
              />
              <FormSelect
                listContent={taxIdentificationTypes}
                label="Tax Identification type"
                name="fi.taxType"
                placeholder="Select an ID type"
                selectedKey={fiValue.taxType}
                setFieldValue={setFieldValue}
                onBlur={handleBlur}
                isInvalid={fiTouched?.taxType && !!fiError?.taxType}
                errorMessage={fiTouched?.taxType && fiError?.taxType}
                isRequired
              />
              <FormInput
                label="Tax Identification Number"
                {...getFieldProps("fi.taxId")}
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
  );
};

export default FormStep1;
