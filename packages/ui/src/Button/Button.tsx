import React from "react";
import { cn } from "../utils/cn";

export type ButtonVariant = "default" | "outline" | "text" | "cta";

export type ButtonColor = "default" | "danger";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  color?: ButtonColor;
  textClassName?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      textClassName,
      variant = "default",
      color = "default",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={props.disabled}
        className={cn(
          "relative overflow-hidden border border-transparent flex flex-row gap-2 px-4 py-2 rounded-3xl items-center justify-center transition-colors",
          {
            "bg-primary": variant === "default",
            "bg-surface border-gray-300": variant === "outline",
            "bg-transparent": variant === "text",
            "cursor-not-allowed": props.disabled,
            "bg-gradient-to-r from-[darkorange] to-[rgb(255,79,0)]":
              variant === "cta",
            "opacity-80": props.disabled && variant === "cta",
            "text-red-500": color === "danger",
            "p-1": variant === "text",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
