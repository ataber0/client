import { cn } from "@campus/ui/cn";
import { InputHTMLAttributes } from "react";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value"> {
  className?: string;
  value?: boolean;
}

export const Checkbox = ({ className, value, ...props }: CheckboxProps) => {
  return (
    <input
      type="checkbox"
      className={cn(
        "h-[18px] w-[18px] min-h-[18px] min-w-[18px] rounded-sm disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      checked={value}
      {...props}
    />
  );
};
