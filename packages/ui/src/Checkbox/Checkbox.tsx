import { cn } from "@campus/ui/cn";
import { InputHTMLAttributes } from "react";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value"> {
  className?: string;
  value?: boolean;
}

export const Checkbox = ({
  className,
  value,
  checked = value,
  ...props
}: CheckboxProps) => {
  return (
    <input
      type="checkbox"
      className={cn(className)}
      checked={checked}
      {...props}
    />
  );
};
