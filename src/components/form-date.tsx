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

  let [date, setDate] = useState(value ? parseAbsoluteToLocal(value) : null);

  useEffect(() => {
    date &&
      setFieldValue &&
      props.name &&
      setFieldValue(props.name, new Date(date.toString()).toISOString());
  }, [date]);

  return (
    <DatePicker
      labelPlacement="outside"
      label={<span className="text-sm text-[#404040]">{label}</span>}
      granularity="day"
      size="lg"
      radius="sm"
      classNames={{
        input: "text-sm",
      }}
      value={date}
      onChange={setDate}
    />
  );
};

export default FormDate;
