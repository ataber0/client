import { DropzoneOptions, useDropzone } from "react-dropzone";
import { Text } from "../Text/Text";
import { cn } from "../utils/cn";

export interface FileInputProps extends Omit<DropzoneOptions, "onDrop"> {
  placeholder?: string;
  className?: string;
  onChange: (files: File[]) => void;
}

export const FileInput = ({
  className,
  onChange,
  placeholder,
  ...options
}: FileInputProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onChange,
    ...options,
  });

  return (
    <div
      className={cn(
        "bg-surface p-10 border-2 border-gray-300 rounded-md cursor-pointer",
        className
      )}
      {...getRootProps()}
    >
      <input {...getInputProps()} />

      <div className="flex items-center justify-center">
        <Text className="text-xs text-gray-400">
          {placeholder || "Upload files"}
        </Text>
      </div>
    </div>
  );
};
