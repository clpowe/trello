import {
  component$,
  useSignal,
  useVisibleTask$,
  useId,
} from "@builder.io/qwik";
import type { Column } from "../../types";
import { nanoid } from "nanoid";
import TrelloBoardTask from "./TrelloBoardTask";
import Sortable from "sortablejs";
import DragHandle from "./DragHandle";

function array_move(arr: any, old_index: number, new_index: number) {
  if (new_index >= arr.length) {
    let k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr;
}

export default component$(() => {
  const columns = useSignal<Column[]>([
    {
      id: nanoid(),
      title: "Backlog",
      task: [
        {
          id: nanoid(),
          title: "Create marketing landing page",
          createdAt: new Date(),
        },
        {
          id: nanoid(),
          title: "Develop cool new feature",
          createdAt: new Date(),
        },
        {
          id: nanoid(),
          title: "Fix page Nav bug",
          createdAt: new Date(),
        },
      ],
    },
    {
      id: nanoid(),
      title: "Selected for Dev",
      task: [],
    },
    {
      id: nanoid(),
      title: "In Progress",
      task: [],
    },
    {
      id: nanoid(),
      title: "QA",
      task: [],
    },
    {
      id: nanoid(),
      title: "Completed",
      task: [],
    },
  ]);
  const columnsId = useId();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const cols = document.getElementById(columnsId);

    if (cols)
      Sortable.create(cols, {
        group: "columns",
        animation: 150,
        handle: ".drag-handle",
        onStart: () => {},
        onEnd(event) {
          const oldIdx = event.oldIndex;
          const newIdx = event.newIndex;
          if (oldIdx && newIdx) array_move(columns.value, oldIdx, newIdx);
        },
      });
  });

  return (
    <>
      <div class="flex items-start gap-4 overflow-x-auto" id={columnsId}>
        {columns.value.map((column) => (
          <div
            key={column.id}
            class="drag-handle min-w-[250px] rounded bg-slate-200 p-5"
          >
            <header class="mb-4 font-bold">
              <DragHandle />
              {column.title}
            </header>
            {column.task.map((task) => (
              <TrelloBoardTask task={task} key={task.id} />
            ))}
            <footer>
              <button class="text-gray-500">+ Add a Card</button>
            </footer>
          </div>
        ))}
      </div>
    </>
  );
});
