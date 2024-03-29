import { cn } from "@/lib/utils";
import { Input, InputProps } from "@nextui-org/react";

const FormInput = ({
  label,
  type = "text",
  placeholder = "Type here",
  ...props
}: InputProps) => {
  return (
    <div className={cn("flex-1", props.className)}>
      <Input
        type={type}
        label={<span className="text-sm text-[#404040]">{label}</span>}
        placeholder={placeholder}
        labelPlacement="outside"
        size="lg"
        radius="sm"
        classNames={{
          input: "text-sm",
        }}
        {...props}
      />
    </div>
  );
};

export default FormInput;
