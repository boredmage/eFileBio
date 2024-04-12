import FormDate from "@/components/form-date";
import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import {
  identifyingDocumentTypes,
  priorityCountries,
  sortedCountries,
  tribalJurisdiction,
  domesticStates,
  foreignCountries,
} from "@/utils/constants";
import { Accordion, AccordionItem, Checkbox, Divider } from "@nextui-org/react";
import clsx from "clsx";
import { FormikErrors, FormikProps } from "formik";
import { LoaderCircle, Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { boFormShape } from "./form-shape";
import { iFormType } from "./form";
import { boFormInterface } from "@/types";
import IdentifyingDocument, {
  IdentifyingDocumentLoader,
} from "../../components/identifying-document";
import { UploadButton } from "@/utils/uploadthing";
import { ClientUploadedFileData } from "uploadthing/types";

const FormStep4 = ({
  formData,
  isPreview,
}: {
  formData: FormikProps<iFormType>;
  isPreview?: boolean;
}) => {
  const [section, setSection] = useState([{}]);
  const { values, setValues, setFieldValue, handleSubmit, submitForm } =
    formData;
  const { bo } = values;

  const handleAddSection = () => {
    setSection([...section, {}]);
    setFieldValue("bo", [...bo, boFormShape]);
    console.log("Add new section");
  };

  const removeSection = (index: number) => {
    if (section.length === 1) return;
    setSection(section.filter((_, i) => i !== index));
    setFieldValue(
      "bo",
      bo.filter((_, i) => i !== index),
    );
  };

  useEffect(() => {
    setSection(bo.length > 0 ? bo : [boFormShape]);
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
  const { bo: value } = values;
  const { bo: touch } = touched;
  const { bo: error } = errors;

  const boValue = value[level];
  const caTouched = touch?.[level];
  const caError = (error?.[level] || {}) as FormikErrors<boFormInterface>;

  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  useEffect(() => {
    const isUnitedStates = boValue.country === "US";
    const isPriorityCty = priorityCountries.some(
      (country) => country.value === boValue.country,
    );
    setIsPriorityCountry(isPriorityCty);
    setIsUnitedStates(isUnitedStates);

    if (isPriorityCty && !isUnitedStates) {
      setFieldValue(`bo.${level}.state`, boValue.country);
    } else {
      setFieldValue(`bo.${level}.state`, "");
    }
  }, [boValue.country]);

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
    const type = boValue.identification.type;

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

  const handleClientUploadComplete = (res: ClientUploadedFileData<null>[]) => {
    const uploadData = res[0];
    const { name, size, type, url } = uploadData;
    setFieldValue(`bo.${level}.identification.image`, url);
    setFieldValue(`bo.${level}.identifyingDocument.name`, name);
    setFieldValue(`bo.${level}.identifyingDocument.size`, size);
    setFieldValue(`bo.${level}.identifyingDocument.type`, type);
    setIsUploadingDoc(false);
    setFieldError(`bo.${level}.identification.image`, "");
    setFieldTouched(`bo.${level}.identification.image`, false);
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
              "flex items-center justify-between pb-0",
              level === 0 && "pt-4",
            )}
          >
            <h2 className="font-semibold">
              Part III. Beneficial Owner Information
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
        {!boValue.isExemptEntity && (
          <>
            <div className="py-6">
              <Checkbox
                color="warning"
                isSelected={Boolean(boValue.isParentGuardianInformation)}
                className="items-start"
                classNames={{
                  icon: "text-white",
                  wrapper: "top-1",
                }}
                isReadOnly={isPreview}
                {...getFieldProps(`bo.${level}.isParentGuardianInformation`)}
              >
                <h2 className="font-semibold">
                  Parent/Guardian information instead of minor child
                </h2>
                <span className="text-[#404040]">
                  (check if the Beneficial Owner is a minor child and the
                  parent/guardian information is provided instead)
                </span>
              </Checkbox>
            </div>
            <Divider className="bg-[#F5F5F5]" />
            <div className="space-y-6 py-6">
              <h2 className="font-semibold">Beneficial Owner FinCEN ID:</h2>
              <div className="grid grid-cols-1 gap-6">
                <FormInput
                  label="FinCEN ID"
                  {...getFieldProps(`bo.${level}.fincenId`)}
                  isReadOnly={isPreview}
                />
              </div>
            </div>
            <Divider className="bg-[#F5F5F5]" />
          </>
        )}
        <div className="flex items-center justify-between py-6">
          <h2 className="font-semibold">Exempt entity</h2>
          <Checkbox
            color="warning"
            isSelected={boValue.isExemptEntity}
            classNames={{
              icon: "text-white",
            }}
            onValueChange={(isSelected) => {
              if (isSelected) {
                const lastNames = boValue.lastName;
                setFieldValue(`bo.${level}`, boFormShape);
                setFieldValue(`bo.${level}.lastName`, lastNames);
              } else {
                setFieldValue(`bo.${level}`, boFormShape);
              }
              setFieldValue(`bo.${level}.isExemptEntity`, isSelected);
            }}
            isReadOnly={isPreview}
          >
            Is this an Exempt entity
          </Checkbox>
        </div>
        {!boValue.isExemptEntity && <Divider className="bg-[#F5F5F5]" />}
        <div className="space-y-6 py-6">
          <h2 className="font-semibold">Full legal name and date of birth:</h2>
          <div className="grid grid-cols-3 gap-6">
            {!boValue.isExemptEntity && (
              <>
                <FormInput
                  label="First name"
                  isRequired
                  {...getFieldProps(`bo.${level}.firstName`)}
                  isReadOnly={isPreview}
                  isInvalid={caTouched?.firstName && !!caError?.firstName}
                  errorMessage={caTouched?.firstName && caError?.firstName}
                />
                <FormInput
                  label="Middle name"
                  {...getFieldProps(`bo.${level}.middleName`)}
                  isReadOnly={isPreview}
                />
              </>
            )}
            <FormInput
              label="Individual's last name or entity's legal name"
              isRequired
              {...getFieldProps(`bo.${level}.lastName`)}
              isReadOnly={isPreview}
              isInvalid={caTouched?.lastName && !!caError?.lastName}
              errorMessage={caTouched?.lastName && caError?.lastName}
            />
          </div>
          {!boValue.isExemptEntity && (
            <div className="grid grid-cols-2 gap-6">
              <FormInput
                label="Suffix"
                {...getFieldProps(`bo.${level}.suffix`)}
                isReadOnly={isPreview}
              />
              <FormDate
                label="Date of birth"
                placeholder="01/01/2024"
                isRequired
                setFieldValue={setFieldValue}
                {...getFieldProps(`bo.${level}.dob`)}
                isReadOnly={isPreview}
                isInvalid={caTouched?.dob && !!caError?.dob}
                errorMessage={caTouched?.dob && caError?.dob}
              />
            </div>
          )}
        </div>
        {!boValue.isExemptEntity && (
          <>
            <Divider className="bg-[#F5F5F5]" />
            <div className="space-y-6 py-6">
              <h2 className="font-semibold">Residential address:</h2>
              <div className="grid grid-cols-2 gap-6">
                <FormSelect
                  listContent={sortedCountries}
                  label="Country/Jurisdiction"
                  isRequired
                  name={`bo.${level}.country`}
                  selectedKey={boValue.country}
                  setFieldValue={setFieldValue}
                  onBlur={handleBlur}
                  isReadOnly={isPreview}
                  isInvalid={caTouched?.country && !!caError?.country}
                  errorMessage={caTouched?.country && caError?.country}
                />
                <FormInput
                  label="Address (number, street, and apt. or suite no.)"
                  isRequired
                  {...getFieldProps(`bo.${level}.address`)}
                  isReadOnly={isPreview}
                  isInvalid={caTouched?.address && !!caError?.address}
                  errorMessage={caTouched?.address && caError?.address}
                />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <FormInput
                  label="City"
                  isRequired
                  {...getFieldProps(`bo.${level}.city`)}
                  isReadOnly={isPreview}
                  isInvalid={caTouched?.city && !!caError?.city}
                  errorMessage={caTouched?.city && caError?.city}
                />
                <FormSelect
                  listContent={getStateForCountry(boValue.country!)}
                  label="State"
                  isRequired
                  name={`bo.${level}.state`}
                  selectedKey={boValue.state}
                  setFieldValue={setFieldValue}
                  onBlur={handleBlur}
                  isReadOnly={isPreview}
                  isInvalid={caTouched?.state && !!caError?.state}
                  errorMessage={caTouched?.state && caError?.state}
                  isDisabled={!isUnitedStates && !!boValue.country}
                />
                <FormInput
                  label="ZIP/Foreign postal code*"
                  isRequired
                  {...getFieldProps(`bo.${level}.zip`)}
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
              <div className="grid grid-cols-2 gap-6">
                <FormSelect
                  listContent={identifyingDocumentTypes}
                  label="Identifying document type"
                  name={`bo.${level}.identification.type`}
                  isRequired
                  selectedKey={boValue.identification.type}
                  setFieldValue={(field, value) => {
                    setFieldValue(
                      `bo.${level}.identification.jurisdiction`,
                      "",
                    );
                    setFieldValue(`bo.${level}.identification.state`, "");
                    setFieldValue(`bo.${level}.identification.otherTribe`, "");
                    setFieldValue(`bo.${level}.identification.localTribal`, "");

                    if (value === "39") {
                      setFieldValue(
                        `bo.${level}.identification.jurisdiction`,
                        "US",
                      );
                    } else {
                      setFieldValue(
                        `bo.${level}.identification.jurisdiction`,
                        "",
                      );
                    }

                    setFieldValue(field, value);
                  }}
                  onBlur={handleBlur}
                  isReadOnly={isPreview}
                  isInvalid={
                    caTouched?.identification?.type &&
                    !!caError?.identification?.type
                  }
                  errorMessage={
                    caTouched?.identification?.type &&
                    caError?.identification?.type
                  }
                />
                <FormInput
                  label="Identifying document number"
                  isRequired
                  {...getFieldProps(`bo.${level}.identification.ID`)}
                  isReadOnly={isPreview}
                  isInvalid={
                    caTouched?.identification?.ID &&
                    !!caError?.identification?.ID
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
              <div className="grid grid-cols-2 gap-6">
                <FormSelect
                  listContent={getCountryForJurisdiction()}
                  label="Country/Jurisdiction"
                  isRequired
                  name={`bo.${level}.identification.jurisdiction`}
                  selectedKey={boValue.identification.jurisdiction}
                  setFieldValue={(field, value) => {
                    setFieldValue(`bo.${level}.identification.state`, "");
                    setFieldValue(`bo.${level}.identification.otherTribe`, "");
                    setFieldValue(`bo.${level}.identification.localTribal`, "");

                    const isPriorityCty = priorityCountries.some(
                      (country) => country.value === value,
                    );
                    const isUnitedStates = value === "US";
                    setIsPriorityJurisdiction(isPriorityCty);
                    if (isPriorityCty && !isUnitedStates) {
                      setFieldValue(`bo.${level}.identification.state`, value);
                    } else {
                      setFieldValue(`bo.${level}.identification.state`, "");
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
                    boValue.identification.jurisdiction === "US" &&
                    boValue.identification.type === "39"
                  }
                />
                <FormSelect
                  listContent={getStateForCountry(
                    boValue.identification.jurisdiction,
                  )}
                  label="State"
                  isRequired
                  name={`bo.${level}.identification.state`}
                  selectedKey={boValue.identification.state}
                  setFieldValue={setFieldValue}
                  isDisabled={
                    (!!boValue.identification.jurisdiction &&
                      !["37", "38"].includes(boValue.identification.type)) ||
                    !!boValue.identification.localTribal ||
                    (isPriorityJurisdiction &&
                      boValue.identification.jurisdiction !== "US") ||
                    boValue.identification.type === "40"
                  }
                  isReadOnly={isPreview}
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
              <div className="grid grid-cols-2 gap-6">
                <FormSelect
                  listContent={tribalJurisdiction}
                  label="Local/Tribal"
                  isRequired
                  name={`bo.${level}.identification.localTribal`}
                  selectedKey={boValue.identification.localTribal}
                  setFieldValue={setFieldValue}
                  isDisabled={
                    boValue.identification.type !== "38" ||
                    !!boValue.identification.state
                  }
                  isReadOnly={isPreview}
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
                  {...getFieldProps(`bo.${level}.identification.otherTribe`)}
                  isDisabled={boValue.identification.localTribal !== "Other"}
                  isReadOnly={isPreview}
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
              {!isPreview && (
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold">
                      Identifying document{" "}
                      <span className="text-red-500">*</span>
                    </h2>
                    {caTouched?.identification?.image &&
                      caError?.identification?.image && (
                        <p className="text-sm text-red-500">
                          {caError.identification.image}
                        </p>
                      )}
                  </div>
                  <UploadButton
                    endpoint="fileUploader"
                    className="outline-none ut-button:w-auto ut-button:rounded-full ut-button:border-2 ut-button:border-warning-500 ut-button:bg-white ut-button:px-4 ut-button:text-sm ut-button:text-black ut-button:outline-none ut-button:after:bg-warning-500 ut-allowed-content:hidden"
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
                </div>
              )}
              {isUploadingDoc && <IdentifyingDocumentLoader />}
              {boValue.identification.image && !isUploadingDoc && (
                <IdentifyingDocument
                  identifyingDocumentName={boValue.identifyingDocument.name}
                  identifyingDocumentType={boValue.identifyingDocument.type}
                  identifyingDocumentSize={boValue.identifyingDocument.size}
                  isReadOnly={isPreview}
                  identifyingDocumentResetHandler={() => {
                    setFieldValue(`bo.${level}.identification.image`, "");
                    setFieldValue(`bo.${level}.identifyingDocument.name`, "");
                    setFieldValue(`bo.${level}.identifyingDocument.size`, "");
                    setFieldValue(`bo.${level}.identifyingDocument.type`, "");
                  }}
                />
              )}
            </div>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export default FormStep4;
