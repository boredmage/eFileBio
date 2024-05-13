"use client";

import FormDate from "@/components/form-date";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import RadioCheckbox from "@/components/radio-checkbox";
import {
  identifyingDocumentTypes,
  priorityCountries,
  sortedCountries,
  tribalJurisdiction,
  domesticStates,
  foreignCountries,
} from "@/utils/constants";
import { Accordion, AccordionItem, Divider } from "@nextui-org/react";
import clsx from "clsx";
import { FormikErrors, FormikProps } from "formik";
import { LoaderCircle, Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { caFormShape } from "./form-shape";
import { iFormType } from "./form";
import { caFormInterface } from "@/types";
import { UploadButton } from "@/utils/uploadthing";
import { ClientUploadedFileData } from "uploadthing/types";
import IdentifyingDocument, {
  IdentifyingDocumentLoader,
} from "../../components/identifying-document";

const FormStep3 = ({
  formData,
  isPreview,
}: {
  formData: FormikProps<iFormType>;
  isPreview?: boolean;
}) => {
  const [section, setSection] = useState([{}]);
  const { values, setValues, setFieldValue, handleSubmit, submitForm } =
    formData;
  const { ca } = values;

  const handleAddSection = () => {
    setSection([...section, {}]);
    setFieldValue("ca", [...ca, caFormShape]);
    console.log("Add new section");
  };

  const removeSection = (index: number) => {
    if (section.length === 1) return;
    setSection(section.filter((_, i) => i !== index));
    setFieldValue(
      "ca",
      ca.filter((_, i) => i !== index),
    );
  };

  useEffect(() => {
    setSection(ca.length > 0 ? ca : [caFormShape]);
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      {section.map((_, index) => (
        <SectionForm
          key={index}
          formData={formData as FormikProps<iFormType>}
          level={index}
          total={section.length}
          removeSection={removeSection}
          handleAddSection={handleAddSection}
          isPreview={isPreview}
        />
      ))}
    </form>
  );
};

const SectionForm = ({
  level,
  removeSection,
  total,
  handleAddSection,
  formData,
  isPreview,
}: {
  level: number;
  total: number;
  removeSection: (index: number) => void;
  handleAddSection: () => void;
  formData: FormikProps<iFormType>;
  isPreview?: boolean;
}) => {
  const [isUnitedStates, setIsUnitedStates] = useState(false);
  const [isPriorityCountry, setIsPriorityCountry] = useState(false);
  const [isPriorityJurisdiction, setIsPriorityJurisdiction] = useState(false);

  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  const {
    values,
    touched,
    errors,
    getFieldProps,
    setFieldValue,
    handleBlur,
    setFieldError,
    setFieldTouched,
  } = formData;
  const { ca: value } = values;
  const { ca: touch } = touched;
  const { ca: error } = errors;

  const caValue = value[level];
  const caTouched = touch?.[level];
  const caError = (error?.[level] || {}) as FormikErrors<caFormInterface>;

  useEffect(() => {
    const isPriorityCty = priorityCountries.some(
      (country) => country.value === caValue.identification.jurisdiction,
    );
    setIsPriorityJurisdiction(isPriorityCty);
  }, [caValue.identification.jurisdiction]);

  useEffect(() => {
    const isUnitedStates = caValue.country === "US";
    const isPriorityCty = priorityCountries.some(
      (country) => country.value === caValue.country,
    );
    setIsPriorityCountry(isPriorityCty);
    setIsUnitedStates(isUnitedStates);
  }, [caValue.country]);

  const getStateForCountry = (dependentCountry: string) => {
    const priorityCountry = priorityCountries.find(
      (country) => country.value === dependentCountry,
    );

    if (priorityCountry && dependentCountry !== "US") {
      return [priorityCountry];
    } else {
      return domesticStates;
    }
  };

  const getCountryForJurisdiction = () => {
    const type = caValue.identification.type;

    if (["37", "38"].includes(type)) {
      return priorityCountries;
    } else if (type === "39") {
      return [{ value: "US", label: "United States of America" }];
    } else if (type === "40") {
      return foreignCountries;
    } else {
      return sortedCountries;
    }
  };

  const clearIdentificationData = () => {
    setFieldValue(`ca.${level}.identification.state`, "");
    setFieldValue(`ca.${level}.identification.jurisdiction`, "");
    setFieldValue(`ca.${level}.identification.otherTribe`, "");
    setFieldValue(`ca.${level}.identification.localTribal`, "");
  };

  const handleClientUploadComplete = (res: ClientUploadedFileData<null>[]) => {
    const uploadData = res[0];
    const { name, size, type, url } = uploadData;
    setFieldValue(`ca.${level}.identification.image`, url);
    setFieldValue(`ca.${level}.identifyingDocument.name`, name);
    setFieldValue(`ca.${level}.identifyingDocument.size`, size);
    setFieldValue(`ca.${level}.identifyingDocument.type`, type);
    setIsUploadingDoc(false);
    setFieldError(`ca.${level}.identification.image`, "");
    setFieldTouched(`ca.${level}.identification.image`, false);
  };

  return (
    <Accordion defaultExpandedKeys={["0"]} isCompact hideIndicator>
      <AccordionItem
        key={`${level}`}
        aria-label="Accordion 1"
        subtitle="Press to expand"
        title={
          <div
            className={clsx(
              "flex flex-col items-start justify-between gap-2 pb-0 lg:flex-row lg:items-center lg:gap-0",
              level === 0 && "pt-4",
            )}
          >
            <h2 className="font-semibold">
              Part II. Company Applicant Information
            </h2>
            <div className="flex items-center justify-center gap-6 text-[#0D0D0D99]">
              <span>
                {level + 1} of {total}
              </span>
              {!isPreview && (
                <div className="flex items-center justify-center gap-3">
                  <span
                    className="rounded-lg bg-[#F5F5F5] p-2 text-black"
                    onClick={handleAddSection}
                  >
                    <Plus />
                  </span>
                  <span
                    className="rounded-lg bg-[#F5F5F5] p-2 text-black"
                    onClick={() => removeSection(level)}
                  >
                    <Minus />
                  </span>
                </div>
              )}
            </div>
          </div>
        }
        classNames={{ content: "overflow-hidden" }}
      >
        <div className="space-y-6 py-6">
          <h2 className="font-semibold">Company Applicant FinCEN ID:</h2>
          <div className="grid grid-cols-1 gap-6">
            <FormInput
              label="FinCEN ID"
              {...getFieldProps(`ca.${level}.fincenId`)}
              isReadOnly={isPreview}
            />
          </div>
        </div>
        <Divider className="bg-[#F5F5F5]" />
        <div className="space-y-6 py-6">
          <h2 className="font-semibold">Full legal name and date of birth:</h2>
          <div className="grid gap-6 xl:grid-cols-3">
            <FormInput
              label="First name"
              isRequired
              {...getFieldProps(`ca.${level}.firstName`)}
              isInvalid={caTouched?.firstName && !!caError?.firstName}
              errorMessage={caTouched?.firstName && caError?.firstName}
              isReadOnly={isPreview}
            />
            <FormInput
              label="Middle name"
              {...getFieldProps(`ca.${level}.middleName`)}
              isReadOnly={isPreview}
            />
            <FormInput
              label="Individual's last name"
              isRequired
              {...getFieldProps(`ca.${level}.lastName`)}
              isReadOnly={isPreview}
              isInvalid={caTouched?.lastName && !!caError?.lastName}
              errorMessage={caTouched?.lastName && caError?.lastName}
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <FormInput
              label="Suffix"
              {...getFieldProps(`ca.${level}.suffix`)}
              isReadOnly={isPreview}
            />
            <FormDate
              label="Date of birth"
              placeholder="01/01/2024"
              isRequired
              setFieldValue={setFieldValue}
              {...getFieldProps(`ca.${level}.dob`)}
              isReadOnly={isPreview}
              isInvalid={caTouched?.dob && !!caError?.dob}
              errorMessage={!!caTouched?.dob && !!caError?.dob}
            />
          </div>
        </div>
        <Divider className="bg-[#F5F5F5]" />
        <div className="space-y-6 py-6">
          <h2 className="font-semibold">Current Address:</h2>
          <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center">
            <h2 className="font-semibold">
              Address type <span className="text-red-500">*</span>
            </h2>
            <RadioCheckbox
              name={`ca.${level}.addressType`}
              isReadOnly={isPreview}
              values={[
                { label: "Business address", value: "BUSINESS" },
                { label: "Residential address", value: "RESIDENTIAL" },
              ]}
              selectedValue={caValue.addressType}
              setFieldValue={setFieldValue}
              onBlur={handleBlur}
              isInvalid={caTouched?.addressType && !!caError?.addressType}
              errorMessage={caTouched?.addressType && caError?.addressType}
            />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <FormSelect
              listContent={sortedCountries}
              label="Country/Jurisdiction"
              isRequired
              name={`ca.${level}.country`}
              selectedKey={caValue.country}
              setFieldValue={(field, value) => {
                const isUnitedStates = value === "US";
                const isPriorityCty = priorityCountries.some(
                  (country) => country.value === value,
                );

                if (isPriorityCty && !isUnitedStates) {
                  setFieldValue(`ca.${level}.state`, value);
                } else {
                  setFieldValue(`ca.${level}.state`, "");
                }

                return setFieldValue(field, value);
              }}
              onBlur={handleBlur}
              isReadOnly={isPreview}
              isInvalid={caTouched?.country && !!caError?.country}
              errorMessage={caTouched?.country && caError?.country}
            />
            <FormInput
              label="Address (number, street, and apt. or suite no.)"
              isRequired
              {...getFieldProps(`ca.${level}.address`)}
              isReadOnly={isPreview}
              isInvalid={caTouched?.address && !!caError?.address}
              errorMessage={caTouched?.address && caError?.address}
            />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <FormInput
              label="City"
              isRequired
              {...getFieldProps(`ca.${level}.city`)}
              isReadOnly={isPreview}
              isInvalid={caTouched?.city && !!caError?.city}
              errorMessage={caTouched?.city && caError?.city}
            />
            <FormSelect
              listContent={getStateForCountry(caValue.country)}
              label="State"
              isRequired
              name={`ca.${level}.state`}
              selectedKey={caValue.state}
              setFieldValue={setFieldValue}
              onBlur={handleBlur}
              isReadOnly={isPreview}
              isInvalid={caTouched?.state && !!caError?.state}
              errorMessage={caTouched?.state && caError?.state}
              isDisabled={!isUnitedStates && !!caValue.country}
            />
            <FormInput
              label="ZIP/Foreign postal code*"
              isRequired
              {...getFieldProps(`ca.${level}.zip`)}
              isReadOnly={isPreview}
              isInvalid={caTouched?.zip && !!caError?.zip}
              errorMessage={caTouched?.zip && caError?.zip}
            />
          </div>
        </div>
        <Divider className="bg-[#F5F5F5]" />
        <div className="space-y-6 py-6">
          <h2 className="font-semibold">
            Form of identification and issuing jurisdiction:
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <FormSelect
              listContent={identifyingDocumentTypes}
              label="Identifying document type"
              name={`ca.${level}.identification.type`}
              isRequired
              selectedKey={caValue.identification.type}
              setFieldValue={(field, value) => {
                clearIdentificationData();

                if (value === "39") {
                  setFieldValue(
                    `ca.${level}.identification.jurisdiction`,
                    "US",
                  );
                } else {
                  setFieldValue(`ca.${level}.identification.state`, "");
                }

                return setFieldValue(field, value);
              }}
              onBlur={handleBlur}
              isReadOnly={isPreview}
              isInvalid={
                caTouched?.identification?.type &&
                !!caError?.identification?.type
              }
              errorMessage={
                caTouched?.identification?.type && caError?.identification?.type
              }
            />
            <FormInput
              label="Identifying document number"
              isRequired
              {...getFieldProps(`ca.${level}.identification.ID`)}
              isReadOnly={isPreview}
              isInvalid={
                caTouched?.identification?.ID && !!caError?.identification?.ID
              }
              errorMessage={
                caTouched?.identification?.ID && caError?.identification?.ID
              }
            />
          </div>{" "}
          <h2 className="font-semibold">
            Identifying document issuing jurisdiction{" "}
            <span className="text-red-500">*</span>
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <FormSelect
              listContent={getCountryForJurisdiction()}
              label="Country/Jurisdiction"
              isRequired
              name={`ca.${level}.identification.jurisdiction`}
              selectedKey={caValue.identification.jurisdiction}
              setFieldValue={(field, value) => {
                clearIdentificationData();

                const isPriorityCty = priorityCountries.some(
                  (country) => country.value === value,
                );

                if (isPriorityCty && value !== "US") {
                  setFieldValue(`ca.${level}.identification.state`, value);
                } else {
                  setFieldValue(`ca.${level}.identification.state`, "");
                }

                return setFieldValue(field, value);
              }}
              isReadOnly={isPreview}
              isInvalid={
                caTouched?.identification?.jurisdiction &&
                !!caError?.identification?.jurisdiction
              }
              errorMessage={
                caTouched?.identification?.jurisdiction &&
                caError?.identification?.jurisdiction
              }
              isDisabled={
                caValue.identification.jurisdiction === "US" &&
                caValue.identification.type === "39"
              }
            />
            <FormSelect
              listContent={getStateForCountry(
                caValue.identification.jurisdiction,
              )}
              label="State"
              isRequired
              name={`ca.${level}.identification.state`}
              selectedKey={caValue.identification.state}
              setFieldValue={setFieldValue}
              isReadOnly={isPreview}
              isDisabled={
                (!!caValue.identification.jurisdiction &&
                  !["37", "38"].includes(caValue.identification.type)) ||
                !!caValue.identification.localTribal ||
                (isPriorityJurisdiction &&
                  caValue.identification.jurisdiction !== "US") ||
                caValue.identification.type === "40"
              }
              isInvalid={
                caTouched?.identification?.state &&
                !!caError?.identification?.state
              }
              errorMessage={
                caTouched?.identification?.state &&
                caError?.identification?.state
              }
            />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <FormSelect
              listContent={tribalJurisdiction}
              label="Local/Tribal"
              isRequired
              name={`ca.${level}.identification.localTribal`}
              selectedKey={caValue.identification.localTribal}
              setFieldValue={setFieldValue}
              isReadOnly={isPreview}
              isDisabled={
                caValue.identification.type !== "38" ||
                !!caValue.identification.state
              }
              isInvalid={
                caTouched?.identification?.localTribal &&
                !!caError?.identification?.localTribal
              }
              errorMessage={
                caTouched?.identification?.localTribal &&
                caError?.identification?.localTribal
              }
            />
            <FormInput
              label="Other local/Tribal description"
              isRequired
              {...getFieldProps(`ca.${level}.identification.otherTribe`)}
              isReadOnly={isPreview}
              isDisabled={caValue.identification.localTribal !== "Other"}
              isInvalid={
                caTouched?.identification?.otherTribe &&
                !!caError?.identification?.otherTribe
              }
              errorMessage={
                caTouched?.identification?.otherTribe &&
                caError?.identification?.otherTribe
              }
            />
          </div>
        </div>
        <Divider className="bg-[#F5F5F5]" />
        <div className="space-y-6 py-6">
          <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center md:gap-0">
            <div>
              <h2 className="font-semibold">
                Identifying document <span className="text-red-500">*</span>
              </h2>
              {caTouched?.identification?.image &&
                caError?.identification?.image && (
                  <p className="text-sm text-red-500">
                    {caError.identification.image}
                  </p>
                )}
            </div>
            {!isPreview && (
              <UploadButton
                endpoint="fileUploader"
                className="w-full outline-none ut-button:w-full ut-button:rounded-full ut-button:border-2 ut-button:border-warning-500 ut-button:bg-white ut-button:px-4 ut-button:text-sm ut-button:text-black ut-button:outline-none ut-button:after:bg-warning-500 ut-allowed-content:hidden md:w-auto md:ut-button:w-auto"
                onBeforeUploadBegin={(files) => {
                  console.log(files);
                  setIsUploadingDoc(true);
                  return files;
                }}
                content={{
                  button: (
                    <span className="flex items-center gap-2">
                      {isUploadingDoc ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        <Plus />
                      )}
                      <span className="block">Add Attachment</span>
                    </span>
                  ),
                }}
                onClientUploadComplete={handleClientUploadComplete}
                onUploadError={(error: Error) => {
                  setIsUploadingDoc(false);
                }}
              />
            )}
          </div>
          {isUploadingDoc && <IdentifyingDocumentLoader />}
          {caValue.identification.image && !isUploadingDoc && (
            <IdentifyingDocument
              identifyingDocumentName={caValue.identifyingDocument.name}
              identifyingDocumentType={caValue.identifyingDocument.type}
              identifyingDocumentSize={caValue.identifyingDocument.size}
              isReadOnly={isPreview}
              identifyingDocumentResetHandler={() => {
                setFieldValue(`ca.${level}.identification.image`, "");
                setFieldValue(`ca.${level}.identifyingDocument.name`, "");
                setFieldValue(`ca.${level}.identifyingDocument.size`, "");
                setFieldValue(`ca.${level}.identifyingDocument.type`, "");
              }}
            />
          )}
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default FormStep3;
