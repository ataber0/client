import { cssInterop } from "nativewind";
import React from "react";
import {
  TextInput as ReactNativeTextInput,
  TextInputProps as RNTextInputProps,
} from "react-native";
import { cn } from "../utils/cn";

interface TextInputProps extends RNTextInputProps {
  className?: string;
}

cssInterop(ReactNativeTextInput, {
  className: "style",
});

export const TextInput = React.forwardRef<
  React.ElementRef<typeof ReactNativeTextInput>,
  TextInputProps
>(({ className, ...props }, ref) => {
  return (
    <ReactNativeTextInput
      ref={ref}
      className={cn(
        "w-full bg-gray-50 rounded-3xl p-4 border-2 border-gray-200 placeholder-gray-500 font-semibold",
        className,
      )}
      placeholderTextColor="gray"
      {...props}
    />
  );
});

TextInput.displayName = "TextInput";
