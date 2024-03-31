import React from "react";
import FormInput from "./form-input";
import {
  einFormat,
  naturalFormat,
  nextDigit,
  ssnFormat,
} from "@/utils/inputFormat";
import { InputProps } from "@nextui-org/react";

const TaxIdFormInput = ({
  taxType,
  setFieldValue,
  value: inputValue,
  ...props
}: InputProps & {
  taxType: string;
  setFieldValue: (field: string, value: typeof inputValue) => void;
}) => {
  const [displayValue, setDisplayValue] = React.useState("");
  const taxIdInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (taxType === "ssn") {
      setDisplayValue(ssnFormat(inputValue as string));
    } else if (taxType === "ein") {
      setDisplayValue(einFormat(inputValue as string));
    } else {
      setDisplayValue(naturalFormat(inputValue as string));
    }
  }, [inputValue, taxType]);

  const handleTaxIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (taxType === "ssn" || taxType === "ein") {
      if (naturalFormat(e.target.value).length > 9) return;
    }

    if (taxIdInputRef.current) {
      let cursorPos = e.target.selectionStart || 0;
      let formatInput = () => {
        if (taxType === "ssn") return ssnFormat(e.target.value);
        if (taxType === "ein") return einFormat(e.target.value);
        return naturalFormat(e.target.value);
      };

      props.name && setFieldValue(props.name, naturalFormat(e.target.value));
      setDisplayValue(formatInput());
      e.target.value = formatInput().toString();
      let isBackspace = e.target.value.length < inputValue!.length;
      let nextCusPos = nextDigit(formatInput(), cursorPos, isBackspace);
      taxIdInputRef?.current.setSelectionRange(nextCusPos + 1, nextCusPos + 1);
    } else {
      props.name && setFieldValue(props.name, naturalFormat(e.target.value));
      setDisplayValue(e.target.value);
    }
  };

  return (
    <FormInput
      label="Tax Identification Number"
      name="fi.taxId"
      onChange={handleTaxIdChange}
      innerRef={taxIdInputRef}
      value={displayValue}
      placeholder={(() => {
        if (taxType === "ssn") return "XXX-XX-XXXX";
        if (taxType === "ein") return "XX-XXXXXXX";
        return undefined;
      })()}
      isDisabled={props.isDisabled}
      isInvalid={props.isInvalid}
      errorMessage={props.errorMessage}
      isRequired
      {...props}
    />
  );
};

export default TaxIdFormInput;
