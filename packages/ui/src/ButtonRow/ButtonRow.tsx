import { cn } from "@campus/ui/cn";
import { Button, ButtonProps } from "../Button/Button";

export interface ButtonRowProps {
  children?: React.ReactNode;
  className?: string;
}

export const ButtonRow = ({ children, className }: ButtonRowProps) => {
  return (
    <div className={cn("flex flex-row gap-1 justify-end", className)}>
      {children}
    </div>
  );
};

const ButtonRowButton = ({ className, ...rest }: ButtonProps) => (
  <Button className={cn("flex-1 sm:flex-initial", className)} {...rest} />
);

ButtonRow.Button = ButtonRowButton;
