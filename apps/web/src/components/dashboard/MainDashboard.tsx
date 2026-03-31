import { cashflow, projects, timesheets } from "@/lib/mock-data";
import { BurndownChart } from "./BurndownChart";
import { KanbanPreview } from "./KanbanPreview";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function kpis() {
  const totalMinutes = timesheets.reduce((acc, item) => acc + item.minutesWorked, 0);
  const totalHours = totalMinutes / 60;
  const income = cashflow.filter((item) => item.kind === "income").reduce((acc, item) => acc + item.amount, 0);
  const expense = cashflow.filter((item) => item.kind === "expense").reduce((acc, item) => acc + item.amount, 0);
  return {
    totalHours: `${totalHours.toFixed(1)}h`,
    activeProjects: projects.filter((project) => project.status === "active").length,
    net: formatCurrency(income - expense),
    roi: `${(((income - expense) / Math.max(income, 1)) * 100).toFixed(1)}%`
  };
}

export default function MainDashboard() {
  const data = kpis();

  return (
    <main className="space-y-6">
      <header className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Principal</h2>
          <p className="text-sm text-zinc-400">Projetos, tempo e finanças em um único painel operacional.</p>
        </div>
        <button className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-brand-400">
          Iniciar Pomodoro
        </button>
      </header>

      <section className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <p className="text-xs text-zinc-400">Horas focadas</p>
          <p className="text-xl font-semibold text-brand-400">{data.totalHours}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <p className="text-xs text-zinc-400">Projetos ativos</p>
          <p className="text-xl font-semibold text-brand-400">{data.activeProjects}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <p className="text-xs text-zinc-400">Saldo líquido</p>
          <p className="text-xl font-semibold text-brand-400">{data.net}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <p className="text-xs text-zinc-400">ROI médio</p>
          <p className="text-xl font-semibold text-brand-400">{data.roi}</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
          <h3 className="mb-3 text-sm font-semibold">Burn-down da sprint</h3>
          <BurndownChart />
        </article>
        <article className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
          <h3 className="mb-3 text-sm font-semibold">Kanban (preview)</h3>
          <KanbanPreview />
        </article>
      </section>
    </main>
  );
}
