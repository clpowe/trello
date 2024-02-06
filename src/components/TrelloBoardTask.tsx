import { component$ } from "@builder.io/qwik";
import type { Task } from "../../types";

interface TaskProps {
  task: Task;
}

export default component$<TaskProps>(({ task }) => {
  return (
    <div
      title={task.createdAt.toLocaleDateString()}
      class="mb-2 max-w-[250px] bg-white p-2 shadow-sm"
    >
      <span>{task.title}</span>
    </div>
  );
});
