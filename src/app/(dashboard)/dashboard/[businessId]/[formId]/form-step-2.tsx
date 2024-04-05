"use client";

import FormInput from "@/components/form-input";
import FormSelect from "@/components/form-select";
import {
  domesticStates,
  foreignCountries,
  foreignStates,
  priorityCountries,
  sortedCountries,
  taxIdentificationTypes,
} from "@/utils/constants";
import { tribalJurisdiction } from "@/utils/tribalJurisdiction";
import { Button, Checkbox, Divider } from "@nextui-org/react";
import { FormikProps } from "formik";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { iFormType } from "./form";
import TaxIdFormInput from "@/components/taxId-form-input";

const FormStep2 = ({
  formData,
  isPreview,
}: {
  formData: FormikProps<iFormType>;
  isPreview?: boolean;
}) => {
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
  const { rc: rcValue } = values;
  const { rc: rcTouched } = touched;
  const { rc: rcError } = errors;

  const [isUnitedStates, setIsUnitedStates] = useState(false);
  const [isPriorityCountry, setIsPriorityCountry] = useState(false);
  const [isAdUnitedStates, setIsAdUnitedStates] = useState(false);
  const [isAdPriorityCountry, setIsAdPriorityCountry] = useState(false);
  const [rcAlternateNameCount, setRcAlternateNameCount] = useState(1);

  const location = isPriorityCountry ? "domestic" : "foreign";

  const resetValueOnDiff = (field: keyof typeof rcValue) => {
    setFieldValue(`rc[${field}]`, "");
    setFieldError(`rc[${field}]`, "");
    setFieldTouched(`rc[${field}]`, false);
  };

  useEffect(() => {
    setRcAlternateNameCount(
      rcValue.alternateNames.length > 0 ? rcValue.alternateNames.length : 1,
    );
  }, []);

  useEffect(() => {
    const isUnitedStates = rcValue.jurisdiction === "US";
    const isPriorityCty = priorityCountries
      .map((c) => c.value)
      .includes(rcValue.jurisdiction);

    setIsUnitedStates(isUnitedStates);
    setIsPriorityCountry(isPriorityCty);
  }, [rcValue.jurisdiction]);

  useEffect(() => {
    setFieldValue("rc.foreignOtherTribe", "");
    setFieldValue("rc.domesticOtherTribe", "");
  }, [rcValue.domesticTribalJurisdiction, rcValue.foreignTribalJurisdiction]);

  const getStateForJurisdiction = (dependentCountry: string) => {
    const priorityCountry = priorityCountries.find(
      (country) => country.value === dependentCountry,
    );

    if (priorityCountry && dependentCountry !== "US") {
      return [priorityCountry];
    } else {
      return domesticStates;
    }
  };

  return (
    <form onSubmit={formData.handleSubmit}>
      <div className="flex items-center justify-between py-6">
        <h2 className="font-semibold">Part I. Reporting Company Information</h2>
        <div className="flex items-center gap-6">
          <Checkbox
            color="warning"
            isSelected={rcValue.isRequestingId}
            classNames={{
              icon: "text-white",
            }}
            isReadOnly={isPreview}
            {...getFieldProps("rc.isRequestingId")}
          >
            Request to receive FinCEN Identifier (FinCEN ID)
          </Checkbox>
          <Checkbox
            color="warning"
            isSelected={rcValue.isForeignPooledInvestmentVehicle}
            classNames={{
              icon: "text-white",
            }}
            isReadOnly={isPreview}
            {...getFieldProps("rc.isForeignPooledInvestmentVehicle")}
          >
            Foreign pooled investment vehicle
          </Checkbox>
        </div>
      </div>
      <Divider className="bg-[#F5F5F5]" />
      <div className="space-y-6 py-6">
        <h2 className="font-semibold">Full legal name and alternate name(s)</h2>
        <div className="grid grid-cols-2 gap-6">
          <FormInput
            label="Reporting Company legal name"
            isRequired
            {...getFieldProps("rc.legalName")}
            isReadOnly={isPreview}
            isInvalid={rcTouched?.legalName && !!rcError?.legalName}
            errorMessage={rcTouched?.legalName && rcError?.legalName}
          />
          {Array(rcAlternateNameCount)
            .fill("_")
            .map((_, index) => (
              <div className="flex items-start" key={index}>
                <div className="flex flex-grow items-end gap-2">
                  <FormInput
                    label="Alternate name (e.g. trade name, DBA)"
                    {...getFieldProps(`rc.alternateNames[${index}]`)}
                    isReadOnly={isPreview}
                  />
                  {!isPreview && (
                    <Button
                      isIconOnly
                      color={
                        index === rcAlternateNameCount - 1
                          ? "warning"
                          : "danger"
                      }
                      aria-label="Like"
                      size="lg"
                      variant="flat"
                      className="text-black"
                      onClick={() =>
                        setRcAlternateNameCount((prev) => {
                          if (index === rcAlternateNameCount - 1)
                            return prev + 1;
                          setFieldValue(
                            "rc.alternateNames",
                            rcValue.alternateNames.filter(
                              (_, i) => i !== index,
                            ),
                          );
                          return prev - 1;
                        })
                      }
                    >
                      {(rcAlternateNameCount > 1 &&
                        index === rcAlternateNameCount - 1) ||
                      rcAlternateNameCount === 1 ? (
                        <Plus />
                      ) : (
                        <Minus />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
      <Divider className="bg-[#F5F5F5]" />
      <div className="space-y-6 py-6">
        <h2 className="font-semibold">Form of identification:</h2>
        <div className="grid grid-cols-3 gap-6">
          <FormSelect
            listContent={taxIdentificationTypes}
            label="Tax Identification type"
            name="rc.taxType"
            placeholder="Select an ID type"
            selectedKey={rcValue.taxType}
            isReadOnly={isPreview}
            setFieldValue={(field, value) => {
              if (value !== "foreign") {
                resetValueOnDiff("taxJurisdiction");
              }
              resetValueOnDiff("taxId");
              return setFieldValue(field, value);
            }}
            onBlur={handleBlur}
            isInvalid={rcTouched?.taxType && !!rcError?.taxType}
            errorMessage={rcTouched?.taxType && rcError?.taxType}
            isRequired
          />
          <TaxIdFormInput
            name="rc.taxId"
            onBlur={handleBlur}
            taxType={rcValue.taxType}
            value={rcValue.taxId}
            setFieldValue={setFieldValue}
            isReadOnly={isPreview}
            isDisabled={!rcValue.taxType}
            isInvalid={rcTouched?.taxId && !!rcError?.taxId}
            errorMessage={rcTouched?.taxId && rcError?.taxId}
            isRequired
          />
          <FormSelect
            listContent={foreignCountries}
            label="Country/Jurisdiction (if foreign tax ID only)"
            name="rc.taxJurisdiction"
            placeholder="Select a country"
            selectedKey={rcValue.taxJurisdiction}
            setFieldValue={setFieldValue}
            onBlur={handleBlur}
            isReadOnly={isPreview}
            isInvalid={rcTouched?.taxJurisdiction && !!rcError?.taxJurisdiction}
            errorMessage={
              rcTouched?.taxJurisdiction && rcError?.taxJurisdiction
            }
            isDisabled={rcValue.taxType !== "foreign"}
            isRequired={rcValue.taxType === "foreign"}
          />
        </div>
      </div>
      <Divider className="bg-[#F5F5F5]" />
      <div className="space-y-6 py-6">
        <h2 className="font-semibold">
          Jurisdiction of formation or first registration:
        </h2>
        <div className="grid grid-cols-1 gap-6">
          <FormSelect
            listContent={sortedCountries}
            label="Country/Jurisdiction of formation"
            isRequired
            name="rc.jurisdiction"
            placeholder="Select a country"
            selectedKey={rcValue.jurisdiction}
            isReadOnly={isPreview}
            setFieldValue={(field, value) => {
              const isUnitedStates = value === "US";
              const isPriorityCty = priorityCountries
                .map((c) => c.value)
                .includes(value as string);

              if (isUnitedStates || !isPriorityCty) {
                [
                  "domesticState",
                  "domesticTribalJurisdiction",
                  "domesticOtherTribe",
                  "foreignFirstState",
                  "foreignTribalJurisdiction",
                  "foreignOtherTribe",
                ].forEach((field) => {
                  resetValueOnDiff(field as keyof typeof rcValue);
                  setFieldError(`rc[${field}]`, "");
                  setFieldTouched(`rc[${field}]`, false);
                });
              }
              if (isPriorityCty && !isUnitedStates) {
                setFieldValue("rc.domesticState", value);
              }
              return setFieldValue(field, value);
            }}
            onBlur={handleBlur}
            isInvalid={rcTouched?.jurisdiction && !!rcError?.jurisdiction}
            errorMessage={rcTouched?.jurisdiction && rcError?.jurisdiction}
          />
        </div>
      </div>
      {location === "domestic" && rcValue.jurisdiction && (
        <div className="space-y-6 pb-6">
          <h2 className="font-semibold">Domestic Reporting Company:</h2>
          <div className="grid grid-cols-3 gap-6">
            <FormSelect
              name="rc.domesticState"
              label="State of formation"
              listContent={getStateForJurisdiction(rcValue.jurisdiction)}
              selectedKey={rcValue.domesticState}
              isReadOnly={isPreview}
              isDisabled={
                (!isUnitedStates && isPriorityCountry) ||
                (!!rcValue.domesticTribalJurisdiction && isUnitedStates)
              }
              setFieldValue={setFieldValue}
              isInvalid={rcTouched?.domesticState && !!rcError?.domesticState}
              errorMessage={rcTouched?.domesticState && rcError?.domesticState}
            />
            {isUnitedStates && (
              <>
                <FormSelect
                  listContent={tribalJurisdiction}
                  label="Tribal jurisdiction of formation"
                  name="rc.domesticTribalJurisdiction"
                  selectedKey={rcValue.domesticTribalJurisdiction}
                  setFieldValue={setFieldValue}
                  onBlur={handleBlur}
                  isDisabled={!!rcValue.domesticState}
                  isReadOnly={isPreview}
                  isInvalid={
                    rcTouched?.domesticTribalJurisdiction &&
                    !!rcError?.domesticTribalJurisdiction
                  }
                  errorMessage={
                    rcTouched?.domesticTribalJurisdiction &&
                    rcError?.domesticTribalJurisdiction
                  }
                />
                <FormInput
                  label="Name of the other Tribe"
                  {...getFieldProps("rc.domesticOtherTribe")}
                  isRequired={rcValue.domesticTribalJurisdiction === "Other"}
                  isDisabled={rcValue.domesticTribalJurisdiction !== "Other"}
                  isReadOnly={isPreview}
                  isInvalid={
                    rcTouched?.domesticOtherTribe &&
                    !!rcError?.domesticOtherTribe
                  }
                  errorMessage={
                    rcTouched?.domesticOtherTribe && rcError?.domesticOtherTribe
                  }
                />
              </>
            )}
          </div>
        </div>
      )}
      {location === "foreign" && rcValue.jurisdiction && (
        <div className="space-y-6 pb-6">
          <h2 className="font-semibold">Foreign Reporting Company:</h2>
          <div className="grid grid-cols-3 gap-6">
            <FormSelect
              listContent={foreignStates}
              label="State of first registration"
              name="rc.foreignFirstState"
              selectedKey={rcValue.foreignFirstState}
              setFieldValue={setFieldValue}
              isDisabled={!!rcValue.foreignTribalJurisdiction}
              isReadOnly={isPreview}
              isInvalid={
                rcTouched?.foreignFirstState && !!rcError?.foreignFirstState
              }
              errorMessage={
                rcTouched?.foreignFirstState && rcError?.foreignFirstState
              }
            />
            <FormSelect
              listContent={tribalJurisdiction}
              label="Tribal jurisdiction of first registration"
              name="rc.foreignTribalJurisdiction"
              selectedKey={rcValue.foreignTribalJurisdiction}
              setFieldValue={setFieldValue}
              isDisabled={!!rcValue.foreignFirstState}
              isReadOnly={isPreview}
              isInvalid={
                rcTouched?.foreignTribalJurisdiction &&
                !!rcError?.foreignTribalJurisdiction
              }
              errorMessage={
                rcTouched?.foreignTribalJurisdiction &&
                rcError?.foreignTribalJurisdiction
              }
            />
            <FormInput
              label="Name of the other Tribe"
              {...getFieldProps("rc.foreignOtherTribe")}
              isRequired={rcValue.foreignTribalJurisdiction === "Other"}
              isDisabled={rcValue.foreignTribalJurisdiction !== "Other"}
              isReadOnly={isPreview}
              isInvalid={
                rcTouched?.foreignOtherTribe && !!rcError?.foreignOtherTribe
              }
              errorMessage={
                rcTouched?.foreignOtherTribe && rcError?.foreignOtherTribe
              }
            />
          </div>
        </div>
      )}
      <Divider className="bg-[#F5F5F5]" />
      <div className="space-y-6 py-6">
        <h2 className="font-semibold">Current U.S. Address:</h2>
        <div className="grid grid-cols-2 gap-6">
          <FormSelect
            listContent={priorityCountries}
            label="U.S. or U.S. Territory"
            name="rc.country"
            selectedKey={rcValue.country}
            setFieldValue={(field, value) => {
              const isAdUs = value === "US";
              const isAdPriorityCty = priorityCountries
                .map((c) => c.value)
                .includes(value as string);
              setIsAdUnitedStates(isAdUs);
              setIsAdPriorityCountry(isAdPriorityCty);

              if (isAdPriorityCty && !isAdUs) {
                setFieldValue("rc.state", value);
              } else {
                resetValueOnDiff("state");
              }
              return setFieldValue(field, value);
            }}
            isRequired
            onBlur={handleBlur}
            isReadOnly={isPreview}
            isInvalid={rcTouched?.country && !!rcError?.country}
            errorMessage={rcTouched?.country && rcError?.country}
          />
          <FormInput
            label="Address (number, street, and apt. or suite no.)"
            {...getFieldProps("rc.address")}
            isRequired
            isReadOnly={isPreview}
            isInvalid={rcTouched?.address && !!rcError?.address}
            errorMessage={rcTouched?.address && rcError?.address}
          />
        </div>
        <div className="grid grid-cols-3 gap-6">
          <FormInput
            label="City"
            {...getFieldProps("rc.city")}
            isRequired
            isReadOnly={isPreview}
            isInvalid={rcTouched?.city && !!rcError?.city}
            errorMessage={rcTouched?.city && rcError?.city}
          />
          <FormSelect
            listContent={getStateForJurisdiction(rcValue.country)}
            label="State"
            name="rc.state"
            selectedKey={rcValue.state}
            setFieldValue={setFieldValue}
            isRequired
            onBlur={handleBlur}
            isReadOnly={isPreview}
            isInvalid={rcTouched?.state && !!rcError?.state}
            errorMessage={rcTouched?.state && rcError?.state}
            isDisabled={!isAdUnitedStates && isAdPriorityCountry}
          />
          <FormInput
            label="Zip Code"
            {...getFieldProps("rc.zip")}
            isRequired
            isReadOnly={isPreview}
            isInvalid={rcTouched?.zip && !!rcError?.zip}
            errorMessage={rcTouched?.zip && rcError?.zip}
          />
        </div>
      </div>
    </form>
  );
};

export default FormStep2;
