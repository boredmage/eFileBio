import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Input,
  InputProps,
} from "@nextui-org/react";
import dayjs from "dayjs";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { cn, formatDate } from "@/lib/utils";
import useToggle from "@/hooks/useToggle";

const FormDate = ({
  label,
  placeholder,
  onChange,
  setFieldValue,
  ...props
}: InputProps & {
  setFieldValue?: (field: string, value: typeof props.value) => void;
}) => {
  const [open, actions] = useToggle();
  const [date, setDate] = useState<string>();
  const { value } = props;

  useEffect(() => {
    typeof value !== "undefined" && setDate(value);
  }, [value]);

  return (
    <Popover isOpen={open} onOpenChange={actions.setVisible}>
      <PopoverTrigger className="text-left">
        <Input
          label={<span className="group text-sm text-[#404040]">{label}</span>}
          className="cursor-pointer"
          placeholder={placeholder}
          labelPlacement="outside"
          size="lg"
          radius="sm"
          {...props}
          startContent={
            <div
              onClick={props?.onClick}
              className="absolute z-10 flex flex-shrink-0 items-center gap-2"
            >
              <span>{props.startContent}</span>
              {!date && (
                <span className="w-full truncate text-left text-sm font-normal text-foreground-500">
                  {placeholder}
                </span>
              )}
            </div>
          }
          endContent={
            date && (
              <div
                className="relative flex h-8 w-8 flex-grow cursor-pointer items-center justify-center rounded-full opacity-0 transition-opacity duration-300 before:absolute before:h-full before:w-full before:rounded-full before:bg-default/40 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 group-hover:opacity-100"
                onClick={(e) => {
                  e?.stopPropagation();
                  e?.preventDefault();

                  if (props.isReadOnly) return;

                  setDate("");
                  onChange?.({
                    target: { value: "" },
                  } as React.ChangeEvent<HTMLInputElement>);
                  setFieldValue?.(props.name as string, "");
                }}
              >
                <X size={16} className="z-50 text-sm text-default-500" />
              </div>
            )
          }
          value={formatDate(date, false)}
          classNames={{
            input: cn(
              "text-left z-20 h-full text-sm cursor-pointer",
              props.startContent && "ps-[30px!important]",
            ),
          }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <DayPicker
          fixedWeeks
          showOutsideDays
          mode="single"
          captionLayout="dropdown"
          fromYear={1900}
          toYear={new Date().getFullYear()}
          selected={dayjs(date).toDate()}
          onSelect={(_val) => {
            const _date = dayjs(_val).toISOString();
            setDate(_date);
            onChange?.({
              target: { value: _date },
            } as React.ChangeEvent<HTMLInputElement>);
            setFieldValue?.(props.name as string, _date);
            actions.onHidden();
          }}
          initialFocus
          disabled={props.isReadOnly}
        />
      </PopoverContent>
    </Popover>
  );
};

export default FormDate;
