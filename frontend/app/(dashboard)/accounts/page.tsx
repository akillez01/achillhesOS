"use client";

import { FormEvent, useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("checking");
  const [balance, setBalance] = useState("0");

  const load = () => api.get("/accounts").then((r) => setAccounts(r.data));
  useEffect(() => { load(); }, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    await api.post("/accounts", { name, type, balance: Number(balance) });
    setName(""); setBalance("0");
    load();
  }

  return <div className="space-y-4"><h2 className="text-2xl font-bold">Contas financeiras</h2><Card><CardHeader><h3 className="font-semibold">Nova conta</h3></CardHeader><CardContent><form className="grid md:grid-cols-4 gap-2" onSubmit={create}><Input placeholder="Nome" value={name} onChange={(e)=>setName(e.target.value)} /><select className="rounded-lg border px-3" value={type} onChange={(e)=>setType(e.target.value)}><option value="wallet">Carteira</option><option value="checking">Conta corrente</option><option value="savings">Poupança</option><option value="credit_card">Cartão de crédito</option><option value="other">Outra</option></select><Input type="number" value={balance} onChange={(e)=>setBalance(e.target.value)} /><Button>Criar</Button></form></CardContent></Card><Card><CardContent className="space-y-2">{accounts.map((a)=><div key={a.id} className="rounded-lg border p-3 text-sm flex justify-between"><span>{a.name}</span><span>R$ {Number(a.balance).toFixed(2)}</span></div>)}</CardContent></Card></div>;
}
