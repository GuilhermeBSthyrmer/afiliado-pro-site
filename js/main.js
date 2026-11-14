/* Afiliado Pro — landing page
 * Demonstração ao vivo, editor de modelo de anúncio e formulário.
 * Sem dependências. Nenhum dado sai do navegador.
 */
(() => {
  'use strict';

  const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];

  /* ---------------- ilustrações dos produtos (SVG autorais) ---------------- */
  const SVG = {
    fone: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M18 60V48a32 32 0 0 1 64 0v12" fill="none" stroke="#141414" stroke-width="6" stroke-linecap="round"/><rect x="10" y="54" width="20" height="32" rx="8" fill="#E30613" stroke="#141414" stroke-width="5"/><rect x="70" y="54" width="20" height="32" rx="8" fill="#E30613" stroke="#141414" stroke-width="5"/><path d="M38 70h24" stroke="#FFD400" stroke-width="5" stroke-linecap="round"/></svg>',
    airfryer: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M24 18h52a8 8 0 0 1 8 8v60H16V26a8 8 0 0 1 8-8z" fill="#141414"/><rect x="24" y="48" width="52" height="30" rx="4" fill="#FFD400"/><rect x="38" y="57" width="24" height="6" rx="3" fill="#141414"/><circle cx="50" cy="33" r="8" fill="#E30613"/><circle cx="50" cy="33" r="3" fill="#fff"/><rect x="20" y="86" width="12" height="6" fill="#141414"/><rect x="68" y="86" width="12" height="6" fill="#141414"/></svg>',
    garrafa: '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="38" y="6" width="24" height="13" rx="3" fill="#141414"/><path d="M34 21h32v9l5 6v52a6 6 0 0 1-6 6H35a6 6 0 0 1-6-6V36l5-6z" fill="#E30613" stroke="#141414" stroke-width="5" stroke-linejoin="round"/><rect x="29" y="50" width="42" height="15" fill="#FFD400"/></svg>',
  };

  /* Produtos de exemplo. Todos ilustrativos. */
  const PRODUTOS = [
    {
      origem: 'Achadinhos da Bia', hora: '14:02', msgOrigem: 'olha esse fone 😱 https://shp.ee/demo',
      store: 'Shopee', fonte: 'API oficial de afiliados', link: 's.shopee.com.br/AbC123', destino: 'Ofertas Tech',
      title: 'Fone Bluetooth com cancelamento de ruído', price: 89.9, original: 159, pix: null, coupon: '',
      description: 'Bateria de até 30 horas com o estojo, conexão Bluetooth 5.3.', svg: SVG.fone,
    },
    {
      origem: 'Promo Casa Total', hora: '15:17', msgOrigem: 'AIR FRYER BAIXOU 🔥 meli.la/1aB2c3',
      store: 'Mercado Livre', fonte: 'API de catálogo', link: 'meli.la/2xYz9Q', destino: 'Casa em Promoção',
      title: 'Air fryer digital 4 L', price: 299, original: 449.9, pix: 284.05, coupon: '',
      description: 'Painel digital com 8 programas e cesto antiaderente.', svg: SVG.airfryer,
    },
    {
      origem: 'Canal Achou Barato', hora: '16:40', msgOrigem: 'garrafa térmica com cupom GARRAFA10 amzn.to/3demo',
      store: 'Amazon', fonte: 'página da oferta', link: 'amzn.to/4aBcDeF', destino: 'Achados do Dia',
      title: 'Garrafa térmica inox 1 L', price: 64.9, original: null, pix: null, coupon: 'GARRAFA10',
      description: 'Mantém a bebida quente por 12 horas e gelada por 24.', svg: SVG.garrafa,
    },
  ];

  const brl = (n) => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /** Desconto arredondado para baixo, só com preço original real. */
  function desconto(p) {
    if (typeof p.original !== 'number' || !(p.price > 0) || !(p.original > p.price)) return null;
    const pct = Math.floor((1 - p.price / p.original) * 100);
    return pct >= 1 ? pct : null;
  }

  /* ---------------- demonstração ao vivo (hero) ---------------- */
  const encarte = $('.encarte');
  if (encarte) {
    const etapas = $$('.etapa', encarte);
    const checks = $$('[data-check]', encarte);
    const campo = (nome) => $(`[data-campo="${nome}"]`, encarte);
    const btnPausar = $('[data-acao="pausar"]', encarte);
    const btnProxima = $('[data-acao="proxima"]', encarte);
    let indice = 0;
    let timers = [];
    let pausado = reduzMovimento;
    if (reduzMovimento) { btnPausar.hidden = true; }

    const limpar = () => { timers.forEach(clearTimeout); timers = []; };
    const depois = (ms, fn) => timers.push(setTimeout(fn, ms));

    function preencher(p) {
      campo('origem').textContent = p.origem;
      campo('msgOrigem').textContent = p.msgOrigem;
      campo('horaOrigem').textContent = p.hora;
      campo('loja').textContent = p.store;
      campo('fonte').textContent = p.fonte;
      campo('linkCurto').textContent = p.link;
      campo('destino').textContent = p.destino;
      campo('titulo').textContent = p.title;
      campo('imagem').innerHTML = p.svg;
      const pct = desconto(p);
      campo('de').textContent = pct ? `de R$ ${brl(p.original)}` : '';
      const [int, cent] = brl(p.price).split(',');
      campo('precoInt').textContent = int;
      campo('precoCent').textContent = ',' + cent;
      campo('desconto').textContent = pct ? `${pct}% OFF` : '';
    }

    function rodar() {
      limpar();
      const p = PRODUTOS[indice];
      preencher(p);
      if (reduzMovimento) {
        etapas.forEach((e) => e.classList.remove('is-espera'));
        checks.forEach((c) => c.classList.remove('is-espera'));
        return;
      }
      etapas.forEach((e) => e.classList.add('is-espera'));
      checks.forEach((c) => c.classList.add('is-espera'));
      depois(250, () => etapas[0].classList.remove('is-espera'));
      depois(1300, () => etapas[1].classList.remove('is-espera'));
      checks.forEach((c, i) => depois(1650 + i * 520, () => c.classList.remove('is-espera')));
      depois(3400, () => etapas[2].classList.remove('is-espera'));
      depois(8200, () => { if (!pausado) { indice = (indice + 1) % PRODUTOS.length; rodar(); } });
    }

    btnPausar.addEventListener('click', () => {
      pausado = !pausado;
      btnPausar.setAttribute('aria-pressed', String(pausado));
      btnPausar.textContent = pausado ? 'Continuar' : 'Pausar';
      if (pausado) {
        limpar();
        etapas.forEach((e) => e.classList.remove('is-espera'));
        checks.forEach((c) => c.classList.remove('is-espera'));
      } else {
        indice = (indice + 1) % PRODUTOS.length;
        rodar();
      }
    });
    btnProxima.addEventListener('click', () => {
      indice = (indice + 1) % PRODUTOS.length;
      if (pausado) {
        preencher(PRODUTOS[indice]);
      } else {
        rodar();
      }
    });

    // Só anima enquanto o encarte está na tela.
    let visivel = true;
    new IntersectionObserver(([e]) => {
      const agora = e.isIntersecting;
      if (agora && !visivel && !pausado) rodar();
      if (!agora) limpar();
      visivel = agora;
    }).observe(encarte);

    rodar();
  }

  /* ---------------- editor de modelo de anúncio ---------------- */
  const PADRAO = '*{title}*\n\n{discount_line}\n💰 {price_line}\n{pix_line}\n\n{coupon_line}\n\n📝 {description}\n\n🔗 {affiliate_url}\n\n⚡ Corra antes que acabe!\n\n👥 Entre no nosso grupo de ofertas: {group_link}';
  const VARS_DE_LINHA = ['{discount_line}', '{coupon_line}', '{pix_line}'];

  function montarMensagem(p, modelo) {
    const pct = desconto(p);
    const valores = {
      '{title}': p.title,
      '{price}': brl(p.price),
      '{original_price}': pct ? brl(p.original) : '',
      '{price_line}': pct ? `De ~R$ ${brl(p.original)}~ por *R$ ${brl(p.price)}*` : `*R$ ${brl(p.price)}*`,
      '{discount_line}': pct ? `🔥 *${pct}% OFF*` : '',
      '{discount}': pct ? `${pct}% OFF` : '',
      '{pix_line}': p.pix ? `💸 *R$ ${brl(p.pix)}* no Pix` : '',
      '{pix_price}': p.pix ? brl(p.pix) : '',
      '{coupon_line}': p.coupon ? `🎟️ Cupom: *${p.coupon}*` : '',
      '{coupon}': p.coupon,
      '{affiliate_url}': 'https://' + p.link,
      '{store}': p.store,
      '{description}': p.description,
      '{group_link}': 'https://chat.whatsapp.com/exemplo',
    };
    // Linha que só tem uma variável de linha vazia some inteira.
    const linhas = modelo.split('\n').filter((linha) => {
      const vazia = VARS_DE_LINHA.some((v) => linha.includes(v) && !valores[v]);
      return !vazia;
    });
    let texto = linhas.join('\n').replace(/\{[a-z_]+\}/g, (m) => (m in valores ? valores[m] : m));
    // Cupom que o modelo não posicionou vai para o fim, como no app.
    if (p.coupon && !modelo.includes('{coupon}') && !modelo.includes('{coupon_line}')) {
      texto += '\n\n' + valores['{coupon_line}'];
    }
    return texto.replace(/\n{3,}/g, '\n\n').trim();
  }

  const escapar = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /** Formatação do WhatsApp: *negrito*, _itálico_, ~riscado~ (um til só). */
  function formatarWhatsApp(texto) {
    return escapar(texto)
      .replace(/\*([^*\n]+)\*/g, '<strong>$1</strong>')
      .replace(/(^|[\s(])_([^_\n]+)_/g, '$1<em>$2</em>')
      .replace(/~([^~\n]+)~/g, '<s>$1</s>')
      .replace(/\n/g, '<br>');
  }

  const area = $('#template');
  if (area) {
    const prevTexto = $('[data-prev="texto"]');
    const prevImg = $('[data-prev="imagem"]');
    const chips = $$('[data-produto]');
    let produtoAtual = 0;
    area.value = PADRAO;

    const atualizar = () => {
      const p = PRODUTOS[produtoAtual];
      prevImg.innerHTML = p.svg;
      prevTexto.innerHTML = formatarWhatsApp(montarMensagem(p, area.value));
    };

    area.addEventListener('input', atualizar);
    chips.forEach((chip) => chip.addEventListener('click', () => {
      produtoAtual = Number(chip.dataset.produto);
      chips.forEach((c) => c.setAttribute('aria-checked', String(c === chip)));
      atualizar();
    }));
    // Setas movem a seleção dentro do grupo de rádio.
    $('.editor__produtos').addEventListener('keydown', (e) => {
      if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
      e.preventDefault();
      const passo = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
      const prox = chips[(produtoAtual + passo + chips.length) % chips.length];
      prox.focus();
      prox.click();
    });
    $$('[data-var]').forEach((b) => b.addEventListener('click', () => {
      const v = b.dataset.var;
      const ini = area.selectionStart ?? area.value.length;
      const fim = area.selectionEnd ?? ini;
      area.setRangeText(v, ini, fim, 'end');
      area.focus();
      atualizar();
    }));
    $('[data-acao="restaurar"]').addEventListener('click', () => { area.value = PADRAO; atualizar(); });
    atualizar();
  }

  /* ---------------- registro "ao vivo" ---------------- */
  const log = $('[data-log]');
  if (log && !reduzMovimento) {
    const extras = [
      ['ok', 'capturado', 'Air fryer 4 L · Mercado Livre · de “Promo Casa Total”'],
      ['ok', 'link', 'link vitrine meli.la gerado'],
      ['info', 'fila', 'enviado para “Casa em Promoção”'],
      ['aviso', 'retentativa', 'loja barrou a consulta. Nova tentativa em 10 min'],
      ['ok', 'capturado', 'Garrafa térmica · Amazon · de “Canal Achou Barato”'],
      ['info', 'fila', 'enviado para “Achados do Dia”'],
      ['aviso', 'ignorado', 'oferta vencida, não será reanunciada'],
    ];
    let i = 0;
    let relogio = new Date();
    relogio.setHours(14, 33, 0, 0);
    let timer = null;
    const tick = () => {
      const [tipo, rotulo, texto] = extras[i % extras.length];
      i++;
      relogio = new Date(relogio.getTime() + (40 + Math.floor(Math.random() * 120)) * 1000);
      const li = document.createElement('li');
      const t = document.createElement('time');
      t.textContent = relogio.toLocaleTimeString('pt-BR');
      const s = document.createElement('span');
      s.className = tipo;
      s.textContent = rotulo;
      li.append(t, s, document.createTextNode(' ' + texto));
      log.append(li);
      while (log.children.length > 6) log.firstElementChild.remove();
    };
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !timer) timer = setInterval(tick, 3200);
      if (!e.isIntersecting && timer) { clearInterval(timer); timer = null; }
    }).observe(log);
  }

  /* ---------------- formulário ---------------- */
  const form = $('[data-form]');
  if (form) {
    const nome = $('#f-nome');
    const contato = $('#f-contato');
    const ok = $('.form__ok', form);

    const erro = (input, idErro, msg) => {
      const alvo = $('#' + idErro);
      alvo.textContent = msg || '';
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg) input.setAttribute('aria-describedby', idErro); else input.removeAttribute('aria-describedby');
      return !msg;
    };
    const validar = () => {
      const n = nome.value.trim();
      const c = contato.value.trim();
      const digitos = c.replace(/\D/g, '');
      const ehEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c);
      const ehFone = !c.includes('@') && digitos.length >= 10 && digitos.length <= 13;
      const a = erro(nome, 'e-nome', n.length < 2 ? 'Escreva seu nome para a gente saber com quem falar.' : '');
      const b = erro(contato, 'e-contato', !c ? 'Informe um WhatsApp com DDD ou um e-mail.' : (!ehEmail && !ehFone ? 'Isso não parece um e-mail nem um WhatsApp com DDD.' : ''));
      return a && b;
    };

    // Erro some enquanto a pessoa digita, nunca no blur: se sumisse no blur, o botão
    // subiria no meio do toque em "Quero testar" e o toque cairia fora dele.
    [nome, contato].forEach((i) => i.addEventListener('input', () => { if (i.getAttribute('aria-invalid') === 'true') validar(); }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validar()) {
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
      $('[data-nome]', form).textContent = nome.value.trim().split(/\s+/)[0];
      ok.hidden = false;
      form.querySelector('button[type="submit"]').disabled = true;
    });
  }
})();
