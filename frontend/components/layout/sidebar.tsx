"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  ["/dashboard", "Dashboard"],
  ["/transactions", "Transações"],
  ["/categories", "Categorias"],
  ["/accounts", "Contas"],
  ["/reports", "Relatórios"],
  ["/planning", "Planejamento"],
  ["/calendar", "Calendário"],
  ["/notifications", "Notificações"]
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 border-r bg-white p-4 dark:bg-slate-950">
      <h1 className="mb-6 text-xl font-bold">Achillhes Finance</h1>
      <nav className="space-y-1">
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "block rounded-lg px-3 py-2 text-sm",
              pathname === href ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
