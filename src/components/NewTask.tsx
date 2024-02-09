import type { QRL } from "@builder.io/qwik";
import { $, component$, useSignal } from "@builder.io/qwik";
import type { Task } from "../../types";
import { nanoid } from "nanoid";

interface NewTaskProps {
  addTask$: QRL<(task: Task) => void>;
}

export default component$<NewTaskProps>(({ addTask$ }) => {
  const focused = useSignal(false);
  const title = useSignal("");

  const createTask = $(async (event: KeyboardEvent) => {
    if (event.key == "Enter") {
      if (title.value.trim()) {
        await addTask$({
          title: title.value.trim(),
          createdAt: new Date(),
          id: nanoid(),
        } as Task);

        title.value = "";
      }
    }
  });

  return (
    <div>
      <textarea
        bind:value={title}
        class={[
          "w-full resize-none rounded border-none bg-transparent focus:bg-white focus:p-2 focus:shadow",
          focused.value ? "h-20" : "h-7",
        ]}
        style="outline: none !important"
        // preventdefault:keydown
        // preventdefault:keyup
        onFocus$={() => (focused.value = true)}
        onBlur$={() => (focused.value = false)}
        placeholder={
          focused.value ? "Enter a title for this card" : "+ Add a Card"
        }
        onKeyDown$={(event) => createTask(event)}
      ></textarea>
    </div>
  );
});
