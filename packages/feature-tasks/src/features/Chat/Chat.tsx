import { ButtonRow } from "@campus/ui/ButtonRow";
import { cn } from "@campus/ui/cn";
import { Loader } from "@campus/ui/Icon";
import { Text } from "@campus/ui/Text";
import { TextArea } from "@campus/ui/TextArea";
import { useState } from "react";
import { TaskCommand, useChat } from "../../data-access/chat.data-access";

export interface ChatProps {
  className?: string;
}

export const Chat = ({ className }: ChatProps) => {
  const { mutateAsync, isPending } = useChat();

  const [taskCommands, setTaskCommands] = useState<TaskCommand[]>([]);

  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await mutateAsync({ message });
    setTaskCommands((existingCommands) => [...existingCommands, response]);
    setMessage("");
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 px-2 pt-2 bg-surface rounded-lg w-96 h-full overflow-y-auto",
        className
      )}
    >
      {taskCommands.map((command) => (
        <div key={command.id} className="flex flex-col gap-4">
          <Text className="border-on-surface border p-2 rounded-lg text-sm">
            {command.userInput}
          </Text>

          <Text>{command.llmMessage}</Text>
        </div>
      ))}

      <form className="bg-surface sticky bottom-0" onSubmit={handleSubmit}>
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <ButtonRow className="mt-2">
          <ButtonRow.Button variant="cta" disabled={isPending} type="submit">
            {isPending ? <Loader className="animate-spin" /> : "Send"}
          </ButtonRow.Button>
        </ButtonRow>
      </form>
    </div>
  );
};
