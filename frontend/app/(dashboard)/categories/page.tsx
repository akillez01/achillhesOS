"use client";

import { FormEvent, useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CategoriesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");

  const load = () => api.get("/categories").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  async function create(e: FormEvent) {
    e.preventDefault();
    await api.post("/categories", { name, type, color: type === "income" ? "#10b981" : "#ef4444" });
    setName("");
    load();
  }

  return <div className="space-y-4"><h2 className="text-2xl font-bold">Categorias</h2><Card><CardHeader><h3 className="font-semibold">Nova categoria</h3></CardHeader><CardContent><form className="flex gap-2" onSubmit={create}><Input placeholder="Nome" value={name} onChange={(e)=>setName(e.target.value)} /><select className="rounded-lg border px-3" value={type} onChange={(e)=>setType(e.target.value)}><option value="expense">Despesa</option><option value="income">Receita</option></select><Button>Criar</Button></form></CardContent></Card><Card><CardContent className="space-y-2">{items.map((item)=><div className="rounded-lg border p-3 text-sm flex justify-between" key={item.id}><span>{item.name}</span><button onClick={async()=>{await api.delete(`/categories/${item.id}`);load();}} className="text-rose-500">Excluir</button></div>)}</CardContent></Card></div>;
}
