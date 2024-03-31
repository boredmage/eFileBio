import { cn } from "@/lib/utils";
import { Input, InputProps } from "@nextui-org/react";

const FormInput = ({
  label,
  type = "text",
  placeholder = "Type here",
  innerRef,
  ...props
}: InputProps & {
  innerRef?: React.RefObject<HTMLInputElement>;
}) => {
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
        ref={innerRef}
        {...props}
      />
    </div>
  );
};

export default FormInput;
