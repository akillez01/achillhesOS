import { tasks } from "@/lib/mock-data";

const columns = ["todo", "in_progress", "review", "done"] as const;

export function KanbanPreview() {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {columns.map((col) => (
        <div key={col} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-400">{col}</h3>
          <div className="space-y-2">
            {tasks
              .filter((task) => task.status === col)
              .map((task) => (
                <div key={task.id} className="rounded-md bg-zinc-900 p-2 text-sm text-zinc-200">
                  {task.title}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
