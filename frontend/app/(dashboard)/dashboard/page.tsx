"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CashflowChart } from "@/components/charts/cashflow-chart";
import api from "@/lib/api";

type DashboardData = {
  current_balance: number;
  income_month: number;
  expense_month: number;
  expected_balance: number;
  latest_transactions: Array<{ id: number; description: string; amount: number; type: string; date: string }>;
  cashflow_chart: Array<{ date: string; income: number; expense: number }>;
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    api.get("/dashboard").then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Carregando...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-4"><p className="text-xs text-slate-500">Saldo atual</p><p className="text-xl font-bold">R$ {data.current_balance.toFixed(2)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-slate-500">Receitas do mês</p><p className="text-xl font-bold text-emerald-600">R$ {data.income_month.toFixed(2)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-slate-500">Despesas do mês</p><p className="text-xl font-bold text-rose-600">R$ {data.expense_month.toFixed(2)}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-xs text-slate-500">Saldo previsto</p><p className="text-xl font-bold">R$ {data.expected_balance.toFixed(2)}</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><h3 className="font-semibold">Entradas x Saídas</h3></CardHeader>
        <CardContent><CashflowChart data={data.cashflow_chart} /></CardContent>
      </Card>
      <Card>
        <CardHeader><h3 className="font-semibold">Últimas transações</h3></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.latest_transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                <div>
                  <p className="font-medium">{tx.description}</p>
                  <p className="text-xs text-slate-500">{tx.date}</p>
                </div>
                <p className={tx.type === "income" ? "text-emerald-600" : "text-rose-600"}>R$ {Number(tx.amount).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
