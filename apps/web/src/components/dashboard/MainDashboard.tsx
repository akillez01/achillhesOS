import React from "react";

type KpiCardProps = {
  title: string;
  value: string;
  delta?: string;
};

const KpiCard = ({ title, value, delta }: KpiCardProps) => (
  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-sm">
    <p className="text-sm text-zinc-400">{title}</p>
    <h3 className="mt-1 text-2xl font-semibold text-zinc-100">{value}</h3>
    {delta ? <p className="mt-2 text-xs text-emerald-400">{delta}</p> : null}
  </div>
);

export default function MainDashboard() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight text-emerald-400">achillhesOS Dashboard</h1>
          <button className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400">
            Iniciar Pomodoro
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 py-6 md:grid-cols-4">
        <KpiCard title="Horas focadas (semana)" value="28h 40m" delta="+12% vs semana anterior" />
        <KpiCard title="Tarefas concluídas" value="34" delta="8 críticas concluídas" />
        <KpiCard title="Saldo mensal" value="R$ 3.420,00" delta="Meta de economia em 76%" />
        <KpiCard title="ROI médio projetos" value="21,8%" delta="2 projetos acima da meta" />
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-8 lg:grid-cols-3">
        <article className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 lg:col-span-2">
          <h2 className="text-base font-semibold text-zinc-100">Burn-down da Sprint Atual</h2>
          <div className="mt-4 h-56 rounded-xl border border-dashed border-zinc-700 bg-zinc-950/40 p-4 text-sm text-zinc-400">
            [Placeholder] Inserir gráfico de queima de tarefas (Recharts/Chart.js)
          </div>
        </article>

        <aside className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5">
          <h2 className="text-base font-semibold text-zinc-100">Alertas de Orçamento</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="rounded-lg bg-zinc-950/60 p-3">
              Projeto <strong>Client Portal</strong>: 87% do orçamento de tempo utilizado.
            </li>
            <li className="rounded-lg bg-zinc-950/60 p-3">
              Projeto <strong>SaaS Boilerplate</strong>: lucro esperado abaixo do alvo (-9%).
            </li>
          </ul>
        </aside>
      </section>
    </main>
  );
}
