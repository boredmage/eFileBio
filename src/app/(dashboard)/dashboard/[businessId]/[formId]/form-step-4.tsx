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
  Checkbox,
  Divider,
} from "@nextui-org/react";
import clsx from "clsx";
import { FormikErrors, FormikProps } from "formik";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { boFormShape } from "./form-shape";
import { iFormType } from "./page";
import { boFormInterface } from "@/types";

const FormStep4 = ({ formData }: { formData: FormikProps<iFormType> }) => {
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
  const { bo: value } = values;
  const { bo: touch } = touched;
  const { bo: error } = errors;

  const boValue = value[level];
  const caTouched = touch?.[level];
  const caError = (error?.[level] || {}) as FormikErrors<boFormInterface>;

  useEffect(() => {
    setFieldValue(`bo.${level}.identification.state`, "");
    setFieldValue(`bo.${level}.identification.otherTribe`, "");
    setFieldValue(`bo.${level}.identification.localTribal`, "");

    const isPriorityCty = priorityCountries.some(
      (country) => country.value === boValue.identification.jurisdiction,
    );
    setIsPriorityJurisdiction(isPriorityCty);
    if (isPriorityCty) {
      setFieldValue(
        `bo.${level}.identification.state`,
        boValue.identification.jurisdiction,
      );
    } else {
      setFieldValue(`bo.${level}.identification.state`, "");
    }
  }, [boValue.identification.jurisdiction]);

  useEffect(() => {
    setFieldValue(`bo.${level}.identification.jurisdiction`, "");
    setFieldValue(`bo.${level}.identification.state`, "");
    setFieldValue(`bo.${level}.identification.otherTribe`, "");
    setFieldValue(`bo.${level}.identification.localTribal`, "");
  }, [boValue.identification.type]);

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

  useEffect(() => {
    if (boValue.identification.type === "39") {
      setFieldValue(`bo.${level}.identification.jurisdiction`, "US");
    } else {
      setFieldValue(`bo.${level}.identification.jurisdiction`, "");
    }
  }, [boValue.identification.type]);

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
        <div className="py-6">
          <Checkbox
            color="warning"
            isSelected={boValue.isParentGuardianInformation}
            className="items-start"
            classNames={{
              icon: "text-white",
              wrapper: "top-1",
            }}
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
            />
          </div>
        </div>
        <Divider className="bg-[#F5F5F5]" />
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
          >
            Is this an Exempt entity
          </Checkbox>
        </div>
        <Divider className="bg-[#F5F5F5]" />
        <div className="space-y-6 py-6">
          <h2 className="font-semibold">Full legal name and date of birth:</h2>
          <div className="grid grid-cols-3 gap-6">
            <FormInput
              label="First name"
              isRequired
              {...getFieldProps(`bo.${level}.firstName`)}
              isInvalid={caTouched?.firstName && !!caError?.firstName}
              errorMessage={caTouched?.firstName && caError?.firstName}
            />
            <FormInput
              label="Middle name"
              {...getFieldProps(`bo.${level}.middleName`)}
            />
            <FormInput
              label="Individual's last name or entity's legal name"
              isRequired
              {...getFieldProps(`bo.${level}.lastName`)}
              isInvalid={caTouched?.lastName && !!caError?.lastName}
              errorMessage={caTouched?.lastName && caError?.lastName}
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <FormInput
              label="Suffix"
              {...getFieldProps(`bo.${level}.suffix`)}
            />
            <FormDate
              label="Date of birth"
              placeholder="01/01/2024"
              isRequired
              setFieldValue={setFieldValue}
              {...getFieldProps(`bo.${level}.dob`)}
              isInvalid={caTouched?.dob && !!caError?.dob}
              errorMessage={caTouched?.dob && caError?.dob}
            />
          </div>
        </div>
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
              isInvalid={caTouched?.country && !!caError?.country}
              errorMessage={caTouched?.country && caError?.country}
            />
            <FormInput
              label="Address (number, street, and apt. or suite no.)"
              isRequired
              {...getFieldProps(`bo.${level}.address`)}
              isInvalid={caTouched?.address && !!caError?.address}
              errorMessage={caTouched?.address && caError?.address}
            />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <FormInput
              label="City"
              isRequired
              {...getFieldProps(`bo.${level}.city`)}
              isInvalid={caTouched?.city && !!caError?.city}
              errorMessage={caTouched?.city && caError?.city}
            />
            <FormSelect
              listContent={getStateForCountry(boValue.country)}
              label="State"
              isRequired
              name={`bo.${level}.state`}
              selectedKey={boValue.state}
              setFieldValue={setFieldValue}
              onBlur={handleBlur}
              isInvalid={caTouched?.state && !!caError?.state}
              errorMessage={caTouched?.state && caError?.state}
              isDisabled={!isUnitedStates && !!boValue.country}
            />
            <FormInput
              label="ZIP/Foreign postal code*"
              isRequired
              {...getFieldProps(`bo.${level}.zip`)}
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
              setFieldValue={setFieldValue}
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
              {...getFieldProps(`bo.${level}.identification.id`)}
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
              name={`bo.${level}.identification.jurisdiction`}
              selectedKey={boValue.identification.jurisdiction}
              setFieldValue={setFieldValue}
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
                  boValue.identification.jurisdiction !== "US")
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
              name={`bo.${level}.identification.localTribal`}
              selectedKey={boValue.identification.localTribal}
              setFieldValue={setFieldValue}
              isDisabled={
                boValue.identification.type !== "38" ||
                !!boValue.identification.state
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
              {...getFieldProps(`bo.${level}.identification.otherTribe`)}
              isDisabled={boValue.identification.localTribal !== "Other"}
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
          {/* <div className="flex items-center justify-between rounded-xl border border-[#F5F5F5] bg-[#FAFAFA] p-3">
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
          </div> */}
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default FormStep4;
