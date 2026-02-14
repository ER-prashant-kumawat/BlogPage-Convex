import Home from "./inner";
import { preloadQuery, preloadedQueryResult } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function ServerPage() {
  // Server-side preload (non-reactive)
  const preloaded = await preloadQuery(api.myFunctions.listNumbers, {
    count: 3,
  });

  const data = preloadedQueryResult(preloaded);

  return (
    <main className="p-8 flex flex-col gap-6 mx-auto max-w-2xl">
      <h1 className="text-4xl font-bold text-center">
        Convex + Next.js
      </h1>

      {/* Server-loaded (non-reactive) */}
      <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-md">
        <h2 className="text-xl font-bold mb-2">
          Non-reactive server-loaded data
        </h2>

        <pre className="text-sm overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>

      {/* Client component with reactive data */}
      <Home preloaded={preloaded} />
    </main>
  );
}
