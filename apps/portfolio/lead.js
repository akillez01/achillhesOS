// Captação: guarda a origem da visita (UTM ou site de onde veio), anexa essa
// origem aos botões de WhatsApp e envia o formulário "Fale comigo".
(() => {
  const CHAVE = 'ao-origem';
  const VALIDADE = 30 * 24 * 60 * 60 * 1000; // 30 dias
  const WHATSAPP = '5592986366861';
  const UTM = ['source', 'medium', 'campaign', 'content', 'term'];

  const ler = () => {
    try {
      const o = JSON.parse(localStorage.getItem(CHAVE) || 'null');
      return o && Date.now() - o.em < VALIDADE ? o : null;
    } catch {
      return null;
    }
  };
  const salvar = (o) => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(o));
    } catch {
      // Sem storage: a origem vale só para esta página.
    }
    return o;
  };

  // Uma campanha com UTM sempre substitui a origem anterior; sem UTM, vale a primeira visita.
  const params = new URLSearchParams(location.search);
  const utm = {};
  UTM.forEach((k) => {
    const v = params.get(`utm_${k}`);
    if (v) utm[k] = v.slice(0, 100);
  });
  let referrer = '';
  try {
    if (document.referrer && new URL(document.referrer).host !== location.host) referrer = document.referrer;
  } catch {
    // referrer inválido: ignora
  }
  const origem = Object.keys(utm).length
    ? salvar({ ...utm, referrer, entrada: location.pathname, em: Date.now() })
    : ler() || salvar({ referrer, entrada: location.pathname, em: Date.now() });

  const rotulo = () => {
    if (origem.source) return [origem.source, origem.campaign].filter(Boolean).join(' / ');
    try {
      return origem.referrer ? new URL(origem.referrer).host.replace(/^www\./, '') : '';
    } catch {
      return '';
    }
  };

  const produtoDaPagina = document.body.dataset.produto || '';

  const registrar = (dados) => {
    const corpo = JSON.stringify({ ...dados, pagina: location.pathname, origem });
    try {
      if (navigator.sendBeacon && navigator.sendBeacon('/api/contato', new Blob([corpo], { type: 'application/json' }))) return;
    } catch {
      // cai para o fetch
    }
    fetch('/api/contato', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: corpo, keepalive: true }).catch(() => {});
  };

  // Botões de WhatsApp: registra o clique e leva a origem no fim da mensagem.
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest && ev.target.closest('a[href^="https://wa.me/"]');
    if (!a || a.closest('[data-lead-form]')) return;
    registrar({ tipo: 'whatsapp', produto: a.dataset.produto || produtoDaPagina });
    const via = rotulo();
    if (!via || a.dataset.origemAnexada) return;
    try {
      const url = new URL(a.href);
      const t = url.searchParams.get('text');
      if (t) {
        url.searchParams.set('text', `${t} (via ${via})`);
        a.href = url.toString();
        a.dataset.origemAnexada = '1';
      }
    } catch {
      // link fora do padrão: segue sem a origem
    }
  });

  // Formulário "Fale comigo"
  document.querySelectorAll('[data-lead-form]').forEach((form) => {
    const status = form.querySelector('[data-lead-status]');
    const produto = form.elements.produto;
    if (produto && produtoDaPagina) produto.value = produtoDaPagina;

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const f = form.elements;
      const nome = f.nome.value.trim();
      if (!nome) {
        status.textContent = 'Escreva seu nome para eu saber com quem falo.';
        status.dataset.estado = 'erro';
        f.nome.focus();
        return;
      }
      const dados = {
        tipo: 'formulario',
        nome,
        contato: f.contato.value.trim(),
        segmento: f.segmento.value,
        produto: f.produto.value,
        mensagem: f.mensagem.value.trim(),
        site: f.site.value,
      };
      registrar(dados);

      const partes = [`Olá Achilles! Sou ${nome}${dados.segmento ? ` (${dados.segmento.toLowerCase()})` : ''}.`];
      partes.push(dados.produto ? `Tenho interesse em: ${dados.produto}.` : 'Quero conversar sobre um projeto.');
      if (dados.mensagem) partes.push(dados.mensagem);
      const link = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(partes.join(' '))}`;

      // Com "noopener" o window.open sempre devolve null, então o link alternativo fica sempre visível.
      window.open(link, '_blank', 'noopener');
      status.innerHTML = '';
      status.dataset.estado = 'ok';
      status.append('Recebi seus dados. O WhatsApp abre com a mensagem pronta; é só enviar. ');
      const alt = document.createElement('a');
      alt.href = link;
      alt.target = '_blank';
      alt.rel = 'noopener';
      alt.textContent = 'Se não abriu, toque aqui.';
      status.append(alt);
      form.reset();
      if (produto && produtoDaPagina) produto.value = produtoDaPagina;
    });
  });
})();
