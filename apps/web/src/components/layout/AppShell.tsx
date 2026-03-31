import Link from "next/link";
import { ReactNode } from "react";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projetos" },
  { href: "/time", label: "Tempo" },
  { href: "/finance", label: "Finanças" }
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
          <h1 className="mb-4 text-lg font-bold text-brand-400">achillhesOS</h1>
          <nav className="space-y-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-brand-400"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">{children}</div>
      </div>
    </div>
  );
}
