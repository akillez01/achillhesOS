"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function ReportsPage() {
  const [month] = useState(new Date().toISOString().slice(0, 7));
  const [cashflow, setCashflow] = useState<any>(null);

  useEffect(() => {
    api.get(`/reports/monthly-cashflow?month=${month}`).then((r) => setCashflow(r.data));
  }, [month]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Relatórios</h2>
      <Card>
        <CardHeader><h3 className="font-semibold">Fluxo de caixa mensal</h3></CardHeader>
        <CardContent className="space-y-2">
          {cashflow ? (
            <>
              <p>Receitas: <strong>R$ {cashflow.income.toFixed(2)}</strong></p>
              <p>Despesas: <strong>R$ {cashflow.expense.toFixed(2)}</strong></p>
              <p>Saldo: <strong>R$ {cashflow.net.toFixed(2)}</strong></p>
            </>
          ) : <p>Carregando...</p>}
          <Button onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/reports/export.csv`, "_blank")}>Exportar CSV</Button>
        </CardContent>
      </Card>
    </div>
  );
}
