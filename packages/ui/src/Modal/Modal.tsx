import { X } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { Button } from "../Button/Button";
import { Text } from "../Text/Text";
import { cn } from "../utils/cn";
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialogDimensions = e.currentTarget.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        "backdrop:bg-black/50 backdrop:backdrop-blur-sm p-0 rounded-lg shadow-xl",
        "border-0 outline-none",
        "w-full max-w-lg",
        "animate-in fade-in-0 zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        className
      )}
      onClose={onClose}
      onClick={handleClick}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-600">
          {title && <Text className="text-sm font-semibold">{title}</Text>}
          <Button
            variant="text"
            onClick={onClose}
            className="ml-auto p-1 rounded-full hover:bg-gray-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </Button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </dialog>
  );
};
