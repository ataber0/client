import { ButtonRow } from "@campus/ui/ButtonRow";
import { cn } from "@campus/ui/cn";
import { Loader } from "@campus/ui/Icon";
import { TextInput } from "@campus/ui/TextInput";
import { useState } from "react";
import { useChat } from "../../data-access/chat.data-access";

export interface ChatProps {
  className?: string;
}

export const Chat = ({ className }: ChatProps) => {
  const { mutate, isPending } = useChat();

  const [message, setMessage] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutate({ message });
      }}
      className={cn("p-2 bg-surface rounded-lg", className)}
    >
      <TextInput onChange={(e) => setMessage(e.target.value)} />

      <ButtonRow className="mt-2">
        <ButtonRow.Button variant="cta" type="submit">
          {isPending ? <Loader className="animate-spin" /> : "Send"}
        </ButtonRow.Button>
      </ButtonRow>
    </form>
  );
};
