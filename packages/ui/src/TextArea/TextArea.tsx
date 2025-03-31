import React from "react";
import { cn } from "../utils/cn";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full bg-surface rounded-3xl p-4 border-2 border-gray-200 placeholder-on-surface font-semibold",
          className
        )}
        {...props}
      />
    );
  }
);

TextArea.displayName = "TextArea";
