import {
  component$,
  useSignal,
  useVisibleTask$,
  useId,
  useStore,
  $,
  useOnWindow,
  useTask$,
} from "@builder.io/qwik";
import { isBrowser } from "@builder.io/qwik/build";
import type { Column, Task } from "../../types";
import { nanoid } from "nanoid";
import TrelloBoardTask from "./TrelloBoardTask";
import NewTask from "./NewTask";
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
  const store = useStore({
    columns: [
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
    ],
  });

  const alt = useSignal(false);
  const columnsId = useId();
  const taskId = useId();

  useOnWindow(
    "keydown",
    $((event: any) => {
      alt.value = event.getModifierState("Alt");
    }),
  );

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => alt.value);

    const cols = document.getElementById(columnsId);

    const tasks = document.querySelectorAll(".tasklist");

    if (cols)
      Sortable.create(cols, {
        group: "columns",
        animation: 150,
        handle: ".drag-handle",
        ghostClass: "sortable-ghost-col",
        chosenClass: "sortable-chosen-col",
        dragClass: "sortable-drag-col",
        onStart: () => {},
        onEnd(event) {
          const oldIdx = event.oldIndex;
          const newIdx = event.newIndex;
          if (oldIdx && newIdx) array_move(store.columns, oldIdx, newIdx);
        },
      });

    for (let i = 0; i < tasks.length; i++) {
      new Sortable(tasks[i] as HTMLElement, {
        group: {
          name: "task",
          pull: alt.value ? "clone" : true,
        },
        animation: 150,
        handle: ".drag-handle",

        ghostClass: "sortable-ghost",
        chosenClass: "sortable-chosen",
        dragClass: "sortable-drag",
        onEnd(event: any) {
          const oldIdx = event.oldIndex;
          const newIdx = event.newIndex;
          if (oldIdx && newIdx) array_move(store.columns, oldIdx, newIdx);
        },
      });
    }
  });

  useTask$(() => {
    if (isBrowser) {
    }
  });

  return (
    <div class="flex items-start gap-4 overflow-x-auto">
      <div class="flex items-start gap-4 " id={columnsId}>
        {store.columns.map((column) => (
          <div
            id={column.id}
            key={column.id}
            class="column drag-handle min-w-[250px] rounded bg-slate-200 p-5"
          >
            <header class="mb-4 font-bold">
              <DragHandle />
              <input
                class="title-input w-4/5 rounded bg-transparent px-1 focus:bg-white"
                type="text"
                onKeyUp$={(event: KeyboardEvent, el) => {
                  if (event.key === "Enter") {
                    el.blur();
                  }
                }}
                onKeyDown$={(event, el) => {
                  if (event.key === "Backspace" && el.value === "") {
                    store.columns = store.columns.filter(
                      (col) => col.id != column.id,
                    );
                  }
                }}
                value={column.title}
                onInput$={(_, el) => (column.title = el.value)}
              />
            </header>
            <div id={taskId} class="tasklist">
              {column.task.map((task: Task) => (
                <TrelloBoardTask
                  task={task}
                  key={task.id}
                  deleteTask$={(id: string) =>
                    (column.task = column.task.filter(
                      (task: Task) => task.id != id,
                    ))
                  }
                />
              ))}
            </div>
            <footer>
              <NewTask addTask$={(task: Task) => column.task.push(task)} />
            </footer>
          </div>
        ))}
      </div>
      <button
        onClick$={() => {
          const column: Column = {
            id: nanoid(),
            title: "",
            task: [],
          };
          store.columns.push(column);

          window.requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                const input = document.querySelector(
                  ".column:last-of-type .title-input",
                ) as HTMLInputElement;
                input.focus();
              });
            });
          });
        }}
        class="whitespace-nowrap rounded bg-gray-200 p-2 opacity-50"
      >
        + Add Another Column
      </button>
    </div>
  );
});
