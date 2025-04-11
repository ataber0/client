import { Button } from "@campus/ui/Button";
import { Trash } from "@campus/ui/Icon";
import { Text } from "@campus/ui/Text";
import { cn } from "@campus/ui/cn";
import { useState } from "react";
import { useRemoveContext } from "../../data-access/remove-context.data-access";
import { ContextItem } from "../../types/context.models";

export interface ContextListProps {
  context: ContextItem[];
  className?: string;
}

export const ContextList = ({ context, className }: ContextListProps) => {
  return (
    <div className={cn("bg-surface p-2 rounded-md", className)}>
      {context.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            index !== context.length - 1 && "border-b border-gray-400 pb-2 mb-2"
          )}
        >
          <ContextListItem item={item} />
        </div>
      ))}
    </div>
  );
};

interface ContextListItemProps {
  item: ContextItem;
}

const ContextListItem = ({ item }: ContextListItemProps) => {
  const { mutate: removeContext, isPending } = useRemoveContext();

  const [showFullText, setShowFullText] = useState(false);

  return (
    <div
      className={cn("flex items-center gap-2", showFullText && "items-start")}
    >
      <Text
        className={cn(
          "flex-1 text-xs cursor-pointer",
          !showFullText && "truncate"
        )}
        onClick={() => setShowFullText(!showFullText)}
      >
        {item.text}
      </Text>

      <Button
        variant="text"
        color="danger"
        className="shrink-0"
        onClick={() => removeContext(item.id)}
        disabled={isPending}
      >
        <Trash size={16} />
      </Button>
    </div>
  );
};
