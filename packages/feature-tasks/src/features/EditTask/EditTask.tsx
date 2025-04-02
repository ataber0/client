import { ButtonRow } from "@campus/ui/ButtonRow";
import { TextArea } from "@campus/ui/TextArea";
import { TextInput } from "@campus/ui/TextInput";
import { useState } from "react";
import { useTaskDetails } from "../../data-access/task-details.data-access";
import { useUpdateTask } from "../../data-access/update-task.data-access";
import { Task, UpdateTaskPayload } from "../../types/task.models";

interface EditTaskProps {
  taskId: string;
  onComplete: () => void;
}

export const EditTask = ({ taskId, onComplete }: EditTaskProps) => {
  const { data: task } = useTaskDetails(taskId);

  return task ? <EditTaskForm task={task} onComplete={onComplete} /> : null;
};

interface EditTaskFormProps {
  task: Task;
  onComplete: () => void;
}

const EditTaskForm = ({ task, onComplete }: EditTaskFormProps) => {
  const { mutateAsync: updateTask } = useUpdateTask(task.id);

  const [payload, setPayload] = useState<UpdateTaskPayload>({
    name: task?.name,
    description: task?.description ?? undefined,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPayload({
      ...payload,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateTask(payload);
    onComplete();
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <label htmlFor="name">Name</label>

        <TextInput id="name" value={payload.name} onChange={handleChange} />
      </div>

      <div className="flex flex-col gap-4">
        <label htmlFor="description">Description</label>

        <TextArea
          id="description"
          value={payload.description}
          onChange={handleChange}
        />
      </div>

      <ButtonRow>
        <ButtonRow.Button variant="outline" onClick={onComplete}>
          Cancel
        </ButtonRow.Button>

        <ButtonRow.Button type="submit">Save</ButtonRow.Button>
      </ButtonRow>
    </form>
  );
};
