"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";

export default function PlanningPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("0");

  const load = () => {
    api.get("/planning/goals").then((r) => setGoals(r.data));
    api.get("/planning/budgets").then((r) => setBudgets(r.data));
  };

  useEffect(() => { load(); }, []);

  async function addGoal() {
    await api.post("/planning/goals", { name: goalName, target_amount: Number(targetAmount), current_amount: 0 });
    setGoalName("");
    setTargetAmount("0");
    load();
  }

  return <div className="space-y-4"><h2 className="text-2xl font-bold">Planejamento</h2><Card><CardHeader><h3 className="font-semibold">Metas financeiras</h3></CardHeader><CardContent className="space-y-3"><div className="flex gap-2"><Input value={goalName} onChange={(e)=>setGoalName(e.target.value)} placeholder="Meta" /><Input type="number" value={targetAmount} onChange={(e)=>setTargetAmount(e.target.value)} placeholder="Valor alvo" /><Button onClick={addGoal}>Adicionar</Button></div>{goals.map((g)=><div key={g.id} className="rounded-lg border p-3 text-sm">{g.name}: R$ {Number(g.current_amount).toFixed(2)} / R$ {Number(g.target_amount).toFixed(2)}</div>)}</CardContent></Card><Card><CardHeader><h3 className="font-semibold">Orçamentos por categoria</h3></CardHeader><CardContent className="space-y-2">{budgets.map((b)=><div key={b.id} className={`rounded-lg border p-3 text-sm ${b.exceeded ? "border-rose-500 bg-rose-50" : ""}`}>Categoria #{b.category_id} ({b.month}) - Usado R$ {b.used_amount.toFixed(2)} de R$ {b.limit_amount.toFixed(2)} {b.exceeded ? "⚠️ limite excedido" : ""}</div>)}</CardContent></Card></div>;
}
