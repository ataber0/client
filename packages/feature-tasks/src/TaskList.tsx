interface TaskListProps {
  tasks: { id: string }[];
}

export function TaskListComponent({ tasks }: TaskListProps) {
  return (
    <div className="p-2 flex gap-2">
      <ul className="list-disc pl-4">
        {[...tasks, { id: "i-do-not-exist", title: "Non-existent Post" }].map(
          (task) => {
            return (
              <li key={task.id} className="whitespace-nowrap">
                {task.id}
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
}
