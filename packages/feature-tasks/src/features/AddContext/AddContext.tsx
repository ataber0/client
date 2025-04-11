import { FileInput } from "@campus/ui/FileInput";
import { useAddContext } from "../../data-access/add-context.data-access";
export interface AddContextProps {
  className?: string;
}

export const AddContext = ({ className }: AddContextProps) => {
  const { mutateAsync: addContext } = useAddContext();

  return (
    <FileInput
      className={className}
      placeholder="Add context"
      multiple={false}
      onChange={async (files) => {
        console.log(files);
        await addContext(files[0]);
      }}
    />
  );
};
