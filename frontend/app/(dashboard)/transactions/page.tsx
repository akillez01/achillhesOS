"use client";

import { FormEvent, useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [form, setForm] = useState({ description: "", amount: "", date: "", type: "expense", category_id: "", account_id: "", payment_method: "Pix", recurrent: false, notes: "", status: "pending" });
  const [categories, setCategories] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);

  const load = () => api.get("/transactions").then((r) => setTransactions(r.data));

  useEffect(() => {
    load();
    api.get("/categories").then((r) => setCategories(r.data));
    api.get("/accounts").then((r) => setAccounts(r.data));
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    await api.post("/transactions", { ...form, amount: Number(form.amount), category_id: Number(form.category_id), account_id: Number(form.account_id), recurrent: Boolean(form.recurrent), status: form.type === "income" ? null : form.status });
    setForm({ description: "", amount: "", date: "", type: "expense", category_id: "", account_id: "", payment_method: "Pix", recurrent: false, notes: "", status: "pending" });
    load();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Receitas e Despesas</h2>
      <Card>
        <CardHeader><h3 className="font-semibold">Novo lançamento</h3></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-3 md:grid-cols-3">
            <Input placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input placeholder="Valor" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <select className="rounded-lg border px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option value="income">Receita</option><option value="expense">Despesa</option></select>
            <select className="rounded-lg border px-3 py-2" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}><option value="">Categoria</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            <select className="rounded-lg border px-3 py-2" value={form.account_id} onChange={(e) => setForm({ ...form, account_id: e.target.value })}><option value="">Conta</option>{accounts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            <Input placeholder="Forma de pagamento/recebimento" value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })} />
            <select className="rounded-lg border px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="paid">Paga</option><option value="pending">Pendente</option><option value="overdue">Atrasada</option></select>
            <Input placeholder="Observações" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <Button type="submit">Salvar</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><h3 className="font-semibold">Lançamentos</h3></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {transactions.map((tx) => <div key={tx.id} className="flex justify-between rounded-lg border p-3 text-sm"><span>{tx.description}</span><span>{tx.type === "income" ? "+" : "-"} R$ {Number(tx.amount).toFixed(2)}</span></div>)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
