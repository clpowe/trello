import type { QRL } from "@builder.io/qwik";
import { $, component$, useSignal } from "@builder.io/qwik";
import type { Task } from "../../types";
import DragHandle from "./DragHandle";

interface TaskProps {
  task: Task;
  deleteTask$: QRL<(id: string) => void>;
}

export default component$<TaskProps>(({ task, deleteTask$ }) => {
  const focused = useSignal(false);

  const deleteTask = $(async (event: KeyboardEvent, id: string) => {
    if (event.key === "Backspace") {
      if (focused.value) {
        await deleteTask$(id);
      }
    }
  });

  return (
    <div
      title={task.createdAt.toLocaleDateString()}
      class="task mb-2 flex max-w-[250px] bg-white p-2 shadow-sm"
      onFocus$={() => (focused.value = true)}
      onBlur$={() => (focused.value = false)}
      tabIndex={0}
      onKeyDown$={(e) => deleteTask(e, task.id)}
    >
      <DragHandle />
      <span>{task.title}</span>
    </div>
  );
});
