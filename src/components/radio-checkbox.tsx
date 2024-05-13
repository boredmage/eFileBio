"use client";

import { Checkbox, CheckboxGroup, CheckboxGroupProps } from "@nextui-org/react";
import { useState } from "react";

const RadioCheckbox = ({
  name,
  value,
  values,
  selectedValue,
  setFieldValue,
  ...props
}: CheckboxGroupProps & {
  values: {
    label: string;
    value: string;
  }[];
  selectedValue: string;
  setFieldValue: (field: string, value: typeof selectedValue) => void;
}) => {
  return (
    <CheckboxGroup
      orientation="horizontal"
      color="warning"
      classNames={{
        wrapper: "gap-8  gap-y-4",
      }}
      name={name}
      value={[selectedValue]}
      onChange={(val) => {
        if (!(val as string[]).length) return;
        let selectedValues = val as string[];
        name && setFieldValue(name, selectedValues[selectedValues.length - 1]);
      }}
      {...props}
    >
      {values.map((value, index) => (
        <Checkbox
          key={index}
          value={value.value}
          classNames={{
            icon: "text-white",
          }}
        >
          {value.label}
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
};

export default RadioCheckbox;
