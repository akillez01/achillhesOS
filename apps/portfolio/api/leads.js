// Lista os contatos para o painel (/painel/). Exige o token do painel.
import { db, garantirTabela, tokenValido } from './_lib.js';

const COLUNAS = ['criado_em', 'tipo', 'nome', 'contato', 'segmento', 'produto', 'mensagem', 'pagina',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'referrer'];

const csvCelula = (v) => {
  const s = v == null ? '' : v instanceof Date ? v.toISOString() : String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ erro: 'Método não permitido.' });
  }
  if (!process.env.PAINEL_TOKEN) return res.status(503).json({ erro: 'Painel não configurado.' });
  if (!tokenValido(req)) return res.status(401).json({ erro: 'Token inválido.' });

  const dias = Math.min(Math.max(parseInt(req.query.dias, 10) || 90, 1), 730);

  try {
    await garantirTabela();
    const q = db();
    const linhas = await q`SELECT criado_em, tipo, nome, contato, segmento, produto, mensagem, pagina,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer
      FROM leads WHERE criado_em > now() - make_interval(days => ${dias})
      ORDER BY criado_em DESC LIMIT 2000`;

    if (req.query.formato === 'csv') {
      const csv = [COLUNAS.join(','), ...linhas.map((l) => COLUNAS.map((c) => csvCelula(l[c])).join(','))].join('\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="contatos-${dias}d.csv"`);
      return res.status(200).send('﻿' + csv);
    }

    return res.status(200).json({ dias, total: linhas.length, contatos: linhas });
  } catch (erro) {
    console.error('[api/leads]', erro);
    return res.status(500).json({ erro: 'Falha ao consultar os contatos.' });
  }
}
