import { Button } from "@campus/ui/Button";
import { ButtonRow } from "@campus/ui/ButtonRow";
import { Plus } from "@campus/ui/Icon";
import { Modal } from "@campus/ui/Modal";
import { TextArea } from "@campus/ui/TextArea";
import { TextInput } from "@campus/ui/TextInput";
import { useState } from "react";
import { useCreateTask } from "../../data-access/create-task.data-access";
import { CreateTaskPayload } from "../../types/task.models";

export interface CreateTaskProps {
  initialPayload?: Partial<CreateTaskPayload>;
  onComplete?: () => void;
}

export const CreateTask = ({ initialPayload, onComplete }: CreateTaskProps) => {
  const { mutateAsync: createTask, isPending } = useCreateTask();

  const [payload, setPayload] = useState<CreateTaskPayload>({
    name: "",
    description: "",
    ...initialPayload,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await createTask(payload);
    onComplete?.();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="task-name">Task Name</label>

        <TextInput
          id="task-name"
          value={payload.name}
          autoFocus
          onChange={(e) => setPayload({ ...payload, name: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="task-description">Task Description</label>

        <TextArea
          id="task-description"
          value={payload.description}
          onChange={(e) =>
            setPayload({ ...payload, description: e.target.value })
          }
        />
      </div>

      <ButtonRow>
        <ButtonRow.Button type="button" variant="outline" onClick={onComplete}>
          Cancel
        </ButtonRow.Button>

        <ButtonRow.Button disabled={!payload.name || isPending} type="submit">
          Create Task
        </ButtonRow.Button>
      </ButtonRow>
    </form>
  );
};

export interface CreateTaskModalButtonProps {
  initialPayload?: Partial<CreateTaskPayload>;
  onComplete?: () => void;
}

export const CreateTaskModalButton = ({
  initialPayload,
  onComplete,
}: CreateTaskModalButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleComplete = () => {
    setIsOpen(false);
    onComplete?.();
  };

  return (
    <>
      <Button variant="text" onClick={() => setIsOpen(true)}>
        <Plus size={16} />
      </Button>

      <Modal isOpen={isOpen} onClose={handleComplete}>
        <CreateTask
          key={isOpen ? "open" : "closed"}
          initialPayload={initialPayload}
          onComplete={handleComplete}
        />
      </Modal>
    </>
  );
};
