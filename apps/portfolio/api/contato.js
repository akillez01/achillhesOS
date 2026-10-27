// Recebe o formulário "Fale comigo" e os cliques nos botões de WhatsApp.
import { corpoJson, db, garantirTabela, hashIp } from './_lib.js';

const TIPOS = new Set(['formulario', 'whatsapp']);
const LIMITE_POR_IP = 20; // envios a cada 10 minutos

const texto = (v, max) => {
  const s = typeof v === 'string' ? v.trim() : '';
  return s ? s.slice(0, max) : null;
};

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  const b = corpoJson(req);
  // Campo invisível: só robô preenche. Responde como sucesso e descarta.
  if (b.site) return res.status(204).end();

  const tipo = TIPOS.has(b.tipo) ? b.tipo : null;
  const nome = texto(b.nome, 120);
  if (!tipo) return res.status(400).json({ erro: 'Tipo inválido.' });
  if (tipo === 'formulario' && !nome) return res.status(400).json({ erro: 'Informe o nome.' });

  const o = b.origem && typeof b.origem === 'object' ? b.origem : {};

  try {
    await garantirTabela();
    const q = db();
    const ipHash = hashIp(req);
    const [{ total }] = await q`SELECT count(*)::int AS total FROM leads
      WHERE ip_hash = ${ipHash} AND criado_em > now() - interval '10 minutes'`;
    if (total >= LIMITE_POR_IP) return res.status(429).json({ erro: 'Muitos envios. Tente daqui a pouco.' });

    await q`INSERT INTO leads (tipo, nome, contato, segmento, produto, mensagem, pagina,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer, ip_hash)
      VALUES (${tipo}, ${nome}, ${texto(b.contato, 120)}, ${texto(b.segmento, 60)}, ${texto(b.produto, 80)},
        ${texto(b.mensagem, 1000)}, ${texto(b.pagina, 200)},
        ${texto(o.source, 100)}, ${texto(o.medium, 100)}, ${texto(o.campaign, 100)},
        ${texto(o.content, 100)}, ${texto(o.term, 100)}, ${texto(o.referrer, 300)}, ${ipHash})`;
    return res.status(204).end();
  } catch (erro) {
    console.error('[api/contato]', erro);
    return res.status(500).json({ erro: 'Não foi possível registrar agora.' });
  }
}
