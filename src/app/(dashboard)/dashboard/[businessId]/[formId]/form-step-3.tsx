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
import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Divider,
} from "@nextui-org/react";
import clsx from "clsx";
import { FormikErrors, FormikProps } from "formik";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { caFormShape } from "./form-shape";
import { iFormType } from "./page";
import { caFormInterface } from "@/types";

const FormStep3 = ({ formData }: { formData: FormikProps<iFormType> }) => {
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
}: {
  level: number;
  total: number;
  removeSection: (index: number) => void;
  handleAddSection: () => void;
  formData: FormikProps<iFormType>;
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
  const { ca: value } = values;
  const { ca: touch } = touched;
  const { ca: error } = errors;

  const caValue = value[level];
  const caTouched = touch?.[level];
  const caError = (error?.[level] || {}) as FormikErrors<caFormInterface>;

  useEffect(() => {
    // setFieldValue(`ca.${level}.identification.state`, "");
    // setFieldValue(`ca.${level}.identification.otherTribe`, "");
    // setFieldValue(`ca.${level}.identification.localTribal`, "");

    const isPriorityCty = priorityCountries.some(
      (country) => country.value === caValue.identification.jurisdiction,
    );
    setIsPriorityJurisdiction(isPriorityCty);
    // if (isPriorityCty && caValue.identification.jurisdiction !== "US") {
    //   setFieldValue(
    //     `ca.${level}.identification.state`,
    //     caValue.identification.jurisdiction,
    //   );
    // } else {
    //   setFieldValue(`ca.${level}.identification.state`, "");
    // }
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
              Part II. Company Applicant Information
            </h2>
            <div className="flex items-center justify-center gap-6 text-[#0D0D0D99]">
              <span>
                {level + 1} of {total}
              </span>
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
            />
          </div>
        </div>
        <Divider className="bg-[#F5F5F5]" />
        <div className="space-y-6 py-6">
          <h2 className="font-semibold">Full legal name and date of birth:</h2>
          <div className="grid grid-cols-3 gap-6">
            <FormInput
              label="First name"
              isRequired
              {...getFieldProps(`ca.${level}.firstName`)}
              isInvalid={caTouched?.firstName && !!caError?.firstName}
              errorMessage={caTouched?.firstName && caError?.firstName}
            />
            <FormInput
              label="Middle name"
              {...getFieldProps(`ca.${level}.middleName`)}
            />
            <FormInput
              label="Individual's last name"
              isRequired
              {...getFieldProps(`ca.${level}.lastName`)}
              isInvalid={caTouched?.lastName && !!caError?.lastName}
              errorMessage={caTouched?.lastName && caError?.lastName}
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <FormInput
              label="Suffix"
              {...getFieldProps(`ca.${level}.suffix`)}
            />
            <FormDate
              label="Date of birth"
              placeholder="01/01/2024"
              isRequired
              setFieldValue={setFieldValue}
              {...getFieldProps(`ca.${level}.dob`)}
              isInvalid={caTouched?.dob && !!caError?.dob}
              errorMessage={caTouched?.dob && caError?.dob}
            />
          </div>
        </div>
        <Divider className="bg-[#F5F5F5]" />
        <div className="space-y-6 py-6">
          <h2 className="font-semibold">Current Address:</h2>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">
              Address type <span className="text-red-500">*</span>
            </h2>
            <RadioCheckbox
              name={`ca.${level}.addressType`}
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
          <div className="grid grid-cols-2 gap-6">
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
              isInvalid={caTouched?.country && !!caError?.country}
              errorMessage={caTouched?.country && caError?.country}
            />
            <FormInput
              label="Address (number, street, and apt. or suite no.)"
              isRequired
              {...getFieldProps(`ca.${level}.address`)}
              isInvalid={caTouched?.address && !!caError?.address}
              errorMessage={caTouched?.address && caError?.address}
            />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <FormInput
              label="City"
              isRequired
              {...getFieldProps(`ca.${level}.city`)}
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
              isInvalid={caTouched?.state && !!caError?.state}
              errorMessage={caTouched?.state && caError?.state}
              isDisabled={!isUnitedStates && !!caValue.country}
            />
            <FormInput
              label="ZIP/Foreign postal code*"
              isRequired
              {...getFieldProps(`ca.${level}.zip`)}
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
              {...getFieldProps(`ca.${level}.identification.id`)}
              isInvalid={
                caTouched?.identification?.id && !!caError?.identification?.id
              }
              errorMessage={
                caTouched?.identification?.id && caError?.identification?.id
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
          <div className="grid grid-cols-2 gap-6">
            <FormSelect
              listContent={tribalJurisdiction}
              label="Local/Tribal"
              isRequired
              name={`ca.${level}.identification.localTribal`}
              selectedKey={caValue.identification.localTribal}
              setFieldValue={setFieldValue}
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
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">
              Identifying document image <span className="text-red-500">*</span>
            </h2>
            <Button
              variant="bordered"
              color="warning"
              radius="full"
              startContent={<Plus />}
              className="text-black"
            >
              Add Attachment
            </Button>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-[#F5F5F5] bg-[#FAFAFA] p-3">
            <div className="flex w-fit gap-4">
              <Avatar
                src={"/pdf-logo.png"}
                className="mx-auto !block h-12 w-12 !rounded-md !bg-transparent text-large"
              />
              <div>
                <h2 className="text-xl font-semibold">
                  New Business eFiling.pdf
                </h2>
                <p className="text-sm text-[#525252]">2.4mb</p>
              </div>
            </div>
            <Button isIconOnly size="lg" className="bg-white shadow-sm">
              <Trash2 className="text-red-500" />
            </Button>
          </div>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default FormStep3;
