import { FileInput } from "@campus/ui/FileInput";
import { useAddContext } from "../../data-access/add-context.data-access";

export interface AddContextProps {
  taskId?: string;
  className?: string;
}

export const AddContext = ({ taskId, className }: AddContextProps) => {
  const { mutateAsync: addContext } = useAddContext();

  return (
    <FileInput
      className={className}
      placeholder="Add context"
      multiple={false}
      onChange={async (files) => {
        await addContext({
          file: files[0],
          taskId,
        });
      }}
    />
  );
};
