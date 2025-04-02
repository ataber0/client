import React from "react";
import { cn } from "../utils/cn";

type TextProps = {
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLParagraphElement>, "as">;

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ as: Component = "p", className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref as React.Ref<HTMLParagraphElement>}
        className={cn("text-on-surface text-base leading-normal", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = "Text";
