import { cashflow } from "@/lib/mock-data";

export function FinancePage() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">Finanças Pessoais</h2>
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
        <p className="mb-3 text-sm text-zinc-400">Fluxo de caixa</p>
        <ul className="space-y-2 text-sm">
          {cashflow.map((entry) => (
            <li key={entry.id} className="rounded-md bg-zinc-900 p-2">
              {entry.occurredAt} · {entry.kind === "income" ? "Entrada" : "Saída"} · R$ {entry.amount} ({entry.category})
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
