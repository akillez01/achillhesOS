import { timesheets } from "@/lib/mock-data";

export function TimePage() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">Gestão de Tempo</h2>
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
        <p className="mb-3 text-sm text-zinc-400">Timesheet recente</p>
        <ul className="space-y-2 text-sm">
          {timesheets.map((item) => (
            <li key={item.id} className="rounded-md bg-zinc-900 p-2">
              {item.date} · Projeto {item.projectId} · {item.minutesWorked} min
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
