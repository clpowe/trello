import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import TrelloBoard from "~/components/TrelloBoard";

export default component$(() => {
  return (
    <>
      <div class="h-[100vh] overflow-auto bg-teal-600 p-10">
        <h1 class="mb-10 flex items-center text-4xl text-white">
          Trello Board
        </h1>
        <TrelloBoard />
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
