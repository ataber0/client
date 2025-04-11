import { Button, ButtonProps } from "@campus/ui/Button";
import { Modal } from "@campus/ui/Modal";
import { useState } from "react";
import { ContextItem } from "../../types/context.models";
import { ContextList } from "../ContextList/ContextList";

export interface ContextModalButtonProps
  extends Omit<ButtonProps, "children" | "onClick"> {
  context: ContextItem[];
  title?: string;
  children?: React.ReactNode;
}

export const ContextModalButton = ({
  context,
  title,
  children,
  ...props
}: ContextModalButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} {...props}>
        {children ?? " Context"}
      </Button>

      <Modal
        title={title ?? "Context"}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <ContextList context={context} />
      </Modal>
    </>
  );
};
