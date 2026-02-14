"use client";

import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type Props = {
  preloaded: Preloaded<typeof api.myFunctions.listNumbers>;
};

export default function Home({ preloaded }: Props) {
  const data = usePreloadedQuery(preloaded);
  const addNumber = useMutation(api.myFunctions.addNumber);

  const handleAdd = async () => {
    await addNumber({ value: Math.floor(Math.random() * 10) });
  };

  return (
    <div className="flex flex-col gap-6 items-start">
      <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-md w-full">
        <h2 className="text-xl font-bold mb-2">
          Reactive client-loaded data
        </h2>

        <pre className="text-sm overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>

      <button
        onClick={handleAdd}
        className="bg-black text-white px-4 py-2 rounded-md"
      >
        Add a random number
      </button>
    </div>
  );
}
