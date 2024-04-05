import { cn } from "@/lib/utils";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
  MenuTriggerAction,
} from "@nextui-org/react";

const FormSelect = ({
  label,
  setFieldValue,
  placeholder = "Select",
  listContent,
  className,
  ...props
}: Omit<AutocompleteProps, "children"> & {
  listContent: {
    label: string;
    value: string;
  }[];
  setFieldValue?: (field: string, value: typeof props.value) => void;
}) => {
  return (
    <div className={cn("relative", className)}>
      <Autocomplete
        label={<span className="text-sm text-[#404040]">{label}</span>}
        placeholder={props.isReadOnly ? " " : placeholder}
        labelPlacement="outside"
        size="lg"
        radius="sm"
        inputProps={{
          classNames: {
            input: "text-sm",
          },
        }}
        onKeyDown={(e: any) => e.continuePropagation()}
        onSelectionChange={(val) => {
          setFieldValue && props.name && setFieldValue(props.name, val);
        }}
        {...props}
      >
        {listContent.map((list, i) => (
          <AutocompleteItem
            key={list.value}
            value={list.value}
            isReadOnly={props.isReadOnly}
            isDisabled={props.isReadOnly}
          >
            {list.label}
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
};

export default FormSelect;
