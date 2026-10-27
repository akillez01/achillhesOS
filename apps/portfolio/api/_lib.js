// Acesso ao banco de contatos (Neon) compartilhado pelas funções de /api.
// Arquivos com "_" no início não viram rota na Vercel.
import { neon } from '@neondatabase/serverless';
import { createHash, timingSafeEqual } from 'node:crypto';

let sql;
let tabelaPronta = false;

export function db() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL não configurada');
  sql ??= neon(process.env.DATABASE_URL);
  return sql;
}

export async function garantirTabela() {
  if (tabelaPronta) return;
  const q = db();
  await q`CREATE TABLE IF NOT EXISTS leads (
    id           bigserial PRIMARY KEY,
    criado_em    timestamptz NOT NULL DEFAULT now(),
    tipo         text NOT NULL,
    nome         text,
    contato      text,
    segmento     text,
    produto      text,
    mensagem     text,
    pagina       text,
    utm_source   text,
    utm_medium   text,
    utm_campaign text,
    utm_content  text,
    utm_term     text,
    referrer     text,
    ip_hash      text
  )`;
  await q`CREATE INDEX IF NOT EXISTS leads_criado_em_idx ON leads (criado_em DESC)`;
  await q`CREATE INDEX IF NOT EXISTS leads_ip_hash_idx ON leads (ip_hash, criado_em)`;
  // Prazo prometido na página de privacidade: até dois anos.
  await q`DELETE FROM leads WHERE criado_em < now() - interval '2 years'`;
  tabelaPronta = true;
}

// O IP não é guardado: só um hash, para limitar envios repetidos.
export function hashIp(req) {
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'desconhecido';
  return createHash('sha256').update(`${process.env.PAINEL_TOKEN || ''}:${ip}`).digest('hex').slice(0, 32);
}

export function tokenValido(req) {
  const esperado = process.env.PAINEL_TOKEN;
  if (!esperado) return false;
  const recebido = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const a = Buffer.from(recebido);
  const b = Buffer.from(esperado);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function corpoJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try {
    return JSON.parse(typeof req.body === 'string' ? req.body : '{}');
  } catch {
    return {};
  }
}
