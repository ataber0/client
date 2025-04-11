import { Button } from "@campus/ui/Button";
import { Trash } from "@campus/ui/Icon";
import { Text } from "@campus/ui/Text";
import { cn } from "@campus/ui/cn";
import { useRemoveContext } from "../../data-access/remove-context.data-access";
import { ContextItem } from "../../types/context.models";
export interface ContextListProps {
  context: ContextItem[];
  className?: string;
}

export const ContextList = ({ context, className }: ContextListProps) => {
  const { mutate: removeContext } = useRemoveContext();

  return (
    <div className={cn("p-2", className)}>
      {context.map((item) => (
        <div key={item.id} className="flex items-center justify-between">
          <Text>{item.text}</Text>

          <Button
            variant="text"
            color="danger"
            className="text-xs"
            onClick={() => removeContext(item.id)}
          >
            <Trash size={16} className="shrink-0" />
          </Button>
        </div>
      ))}
    </div>
  );
};
