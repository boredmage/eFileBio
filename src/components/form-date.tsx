import { InputProps, DatePicker } from "@nextui-org/react";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { useEffect, useState } from "react";

const FormDate = ({
  label,
  placeholder,
  onChange,
  setFieldValue,
  ...props
}: InputProps & {
  setFieldValue?: (field: string, value: typeof props.value) => void;
}) => {
  const { value } = props;

  let [date, setDate] = useState(
    value ? parseAbsoluteToLocal(new Date(value).toISOString()) : null,
  );

  useEffect(() => {
    date &&
      setFieldValue &&
      props.name &&
      setFieldValue(
        props.name,
        new Date(date.toAbsoluteString()).toISOString(),
      );
  }, [date]);

  return (
    <DatePicker
      isRequired={props.isRequired}
      errorMessage={props.errorMessage}
      labelPlacement="outside"
      label={<span className="text-sm text-[#404040]">{label}</span>}
      granularity="day"
      size="lg"
      radius="sm"
      classNames={{
        input: "text-sm",
      }}
      value={date}
      onChange={(date) => {
        setDate(parseAbsoluteToLocal(new Date(date.toDate()).toISOString()));
      }}
    />
  );
};

export default FormDate;
