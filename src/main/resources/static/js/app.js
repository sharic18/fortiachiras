/* Sitio público Fortiachiras. Los datos editables están en js/config.js */
const PAGINA = document.body.dataset.page;
const S = SITIO;

/* Los textos de la interfaz vienen del servidor */
let MSG = {};
const IDIOMAS = [['es', 'ES', 'Español'], ['en', 'EN', 'English'], ['fr', 'FR', 'Français']];
const SUF = { en: 'En', fr: 'Fr' };
const LOCALE = { es: 'es-CO', en: 'en-US', fr: 'fr-FR' };
const TITULO_PAG = { index: 'nav_inicio', catalogo: 'nav_catalogo', cultura: 'nav_cultura',
  proceso: 'nav_proceso', puntos: 'nav_puntos', carrito: 'nav_carrito' };
const NAV = [['index', 'index.html', 'nav_inicio'], ['catalogo', 'catalogo.html', 'nav_catalogo'],
  ['cultura', 'cultura.html', 'nav_cultura'], ['proceso', 'proceso.html', 'nav_proceso'],
  ['puntos', 'puntos-venta.html', 'nav_puntos']];

let idioma = 'es';
try { idioma = localStorage.getItem('idioma') || 'es'; } catch (e) { }
if (!IDIOMAS.some(l => l[0] === idioma)) idioma = 'es';
let categorias = [], productos = [], cultura = [], proceso = [], puntos = [];
let categoriaActiva = null, busqueda = '', puntoActivo = 0;

/* ---------- Utilidades ---------- */
const t = k => (MSG[k] !== undefined ? MSG[k] : k);
const T = o => (o && typeof o === 'object') ? (o[idioma] ?? o.es) : o;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const campo = (o, base) => (SUF[idioma] && o[base + SUF[idioma]]) ? o[base + SUF[idioma]] : o[base];
const precio = n => new Intl.NumberFormat(LOCALE[idioma],
  { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
const wsp = (msg, num) => `https://wa.me/${num || S.whatsapp}?text=${encodeURIComponent(msg)}`;
const norm = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const titulo = txt => `<h2 class="titulo-seccion">${esc(txt)}</h2>`;
const telWsp = tel => { const d = String(tel || '').replace(/\D/g, ''); return d.length === 10 ? '57' + d : d; };

function foto(f, alt, cls) {
  return `<img src="img/${esc(f)}" alt="${esc(alt)}" class="${cls || ''}" loading="lazy" onerror="this.onerror=null;this.src='img/placeholder.jpg'">`;
}
function imagen(url, alt, clase) {
  if (url) return `<img src="${esc(url)}" alt="${esc(alt)}" class="${clase}" loading="lazy">`;
  return `<div class="${clase} placeholder-img" role="img" aria-label="${esc(alt)}"><span>${t('sin_imagen')}</span></div>`;
}
const cabeceraPagina = (txt, img) =>
  `<section class="cabecera-pagina con-foto" style="--foto: url('/img/${img}')"><div class="container">
    <nav class="migas" aria-label="${esc(t('bc_label'))}"><ol><li><a href="index.html">${t('nav_inicio')}</a></li><li aria-current="page">${t(TITULO_PAG[PAGINA])}</li></ol></nav>
    <h1>${esc(txt)}</h1></div></section>`;
const figVisita = (v, col) => `<div class="${col}"><figure class="galeria-item mb-0">
    ${foto(v.foto, `${T(v.titulo)}. ${T(v.detalle)}`)}<figcaption><strong>${esc(T(v.titulo))}</strong><span>${esc(T(v.detalle))}</span></figcaption></figure></div>`;
const parrafos = txt => String(txt || '').split(/\n+/).filter(Boolean).map(p => `<p>${esc(p)}</p>`).join('');
const esLicor = p => p.categoria && /licor/i.test(p.categoria.nombre || '');

function videoHtml() {
  if (S.videoYoutube) {
    return `<div class="ratio ratio-16x9 video-caja"><iframe
      src="https://www.youtube-nocookie.com/embed/${esc(S.videoYoutube)}?cc_load_policy=1&hl=${idioma}&rel=0"
      title="${esc(t('video_iframe'))}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"
      allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>`;
  }
  return `<div class="ratio ratio-16x9 video-caja video-ph"><div class="d-flex flex-column align-items-center justify-content-center text-center p-3">
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#FFD21F"/><path d="M25 18v28l24-14z" fill="#2B1B12"/></svg>
    <p class="mt-3 mb-0">${t('video_pend')}</p></div></div>`;
}

/* ---------- Carrito (se guarda en el navegador) ---------- */
function leerCarrito() { try { return JSON.parse(localStorage.getItem('carrito')) || []; } catch (e) { return []; } }
function guardarCarrito(c) { try { localStorage.setItem('carrito', JSON.stringify(c)); } catch (e) { } actualizarBadge(); }
function actualizarBadge() {
  const n = leerCarrito().reduce((s, i) => s + i.cant, 0);
  $('#cartCount').text(n);
  $('#btnCarrito').attr('aria-label', `${t('nav_carrito')}: ${n}`);
}
function avisar(msg) {
  const el = $('#toastCarrito').text(msg).addClass('visible');
  clearTimeout(avisar.tm);
  avisar.tm = setTimeout(() => el.removeClass('visible'), 2200);
}
function agregarAlCarrito(id) {
  const p = productos.find(x => x.id === id);
  if (!p) return;
  const c = leerCarrito();
  const it = c.find(x => x.id === id);
  if (it) it.cant = Math.min(99, it.cant + 1);
  else c.push({ id: p.id, nombre: p.nombre, nombreEn: p.nombreEn, nombreFr: p.nombreFr, precio: Number(p.precio), imagenUrl: p.imagenUrl, cant: 1 });
  guardarCarrito(c);
  avisar(t('agregado'));
}
function cambiarCantidad(id, delta) {
  let c = leerCarrito();
  const it = c.find(x => x.id === id);
  if (!it) return;
  it.cant = Math.min(99, it.cant + delta);
  if (it.cant <= 0) c = c.filter(x => x.id !== id);
  guardarCarrito(c); renderCarrito();
}
function quitarDelCarrito(id) { guardarCarrito(leerCarrito().filter(x => x.id !== id)); renderCarrito(); }

function mensajePedido() {
  const c = leerCarrito(); let total = 0;
  const lineas = c.map(it => { const sub = it.precio * it.cant; total += sub; return `- ${it.cant} x ${it.nombre} (${precio(sub)})`; });
  const extra = [];
  const n = $('#cliNombre').val(), ci = $('#cliCiudad').val(), no = $('#cliNotas').val();
  if (n) extra.push(`${t('ped_nombre')}: ${n}`);
  if (ci) extra.push(`${t('ped_ciudad')}: ${ci}`);
  if (no) extra.push(`${t('ped_notas')}: ${no}`);
  return `${t('ped_intro')}\n${lineas.join('\n')}\n${t('total')}: ${precio(total)}` + (extra.length ? '\n\n' + extra.join('\n') : '');
}
function renderCarrito() {
  const c = leerCarrito();
  $('#carritoVacio').toggleClass('d-none', c.length > 0);
  $('#carritoContenido').toggleClass('d-none', c.length === 0);
  if (!c.length) return;
  let total = 0;
  $('#carritoFilas').html(c.map(it => {
    const sub = it.precio * it.cant; total += sub;
    const nom = campo(it, 'nombre');
    return `<tr>
      <td><div class="d-flex align-items-center gap-2">${imagen(it.imagenUrl, nom, 'miniatura')}<span>${esc(nom)}</span></div></td>
      <td>${precio(it.precio)}</td>
      <td><div class="d-flex align-items-center gap-2">
        <button type="button" class="btn btn-sm btn-outline-secondary btn-menos" data-id="${it.id}" aria-label="${t('menos')}">−</button>
        <span>${it.cant}</span>
        <button type="button" class="btn btn-sm btn-outline-secondary btn-mas" data-id="${it.id}" aria-label="${t('mas')}">+</button>
      </div></td>
      <td>${precio(sub)}</td>
      <td><button type="button" class="btn btn-sm btn-outline-danger btn-quitar" data-id="${it.id}">${t('quitar')}</button></td>
    </tr>`;
  }).join(''));
  $('#carritoTotal').text(precio(total));
}

/* ---------- Vistas (estructura de cada página) ---------- */
function vistaIndex() {
  const tiles = [['catalogo.html', 'portada-catalogo.jpg', 'nav_catalogo', 'card_cat_d'],
    ['cultura.html', 'portada-cultura.jpg', 'nav_cultura', 'card_cul_d'],
    ['proceso.html', 'portada-proceso.jpg', 'nav_proceso', 'card_pro_d'],
    ['puntos-venta.html', 'portada-puntos.jpg', 'nav_puntos', 'card_pun_d']].map(([href, img, tt, dd]) => `
    <div class="col-6 col-lg-3"><a class="tarjeta-acceso" href="${href}" style="--foto: url('/img/${img}')">
      <h2>${t(tt)}</h2><p class="mb-0">${t(dd)}</p></a></div>`).join('');
  const cifras = S.cifras.map(c => `<div class="col-6 col-md-3"><div class="cifra"><strong>${esc(c.valor)}</strong><span>${esc(T(c.etiqueta))}</span></div></div>`).join('');
  const vis = S.visitas.slice(0, 3).map(v => figVisita(v, 'col-6 col-md-4')).join('');
  return `
  <section class="hero"><div class="container">
    <p class="hero-pre">${t('hero_pre')}</p><h1>${t('hero_titulo')}</h1>
    <p class="lead">${t('hero_texto')}</p><a class="btn btn-ladrillo btn-lg" href="catalogo.html">${t('hero_btn')}</a>
  </div></section>
  <section class="cifras"><div class="container"><div class="row g-3 text-center">${cifras}</div></div></section>
  <div class="container mt-4"><div id="aviso" class="alert alert-warning d-none" role="alert"></div></div>
  <section class="seccion"><div class="container"><div class="row g-4">${tiles}</div></div></section>
  <section class="seccion seccion-alterna"><div class="container">${titulo(t('dest_titulo'))}
    <div id="destacados"></div>
    <div class="text-center mt-4"><a class="btn btn-outline-secondary" href="catalogo.html">${t('dest_todos')}</a></div>
  </div></section>
  <section class="seccion"><div class="container"><div class="row g-4 gy-4 align-items-center">
    <div class="col-lg-6">${videoHtml()}<p class="small text-muted mt-2 mb-0">${t('video_desc')}</p></div>
    <div class="col-lg-6"><span class="chip">${t('hist_chip')}</span><h2 class="titulo-izq">${t('hist_titulo')}</h2>
      <p class="lead">${t('hist_texto')}</p><a class="btn btn-ladrillo" href="cultura.html">${t('hist_btn')}</a></div>
  </div></div></section>
  <section class="seccion seccion-alterna"><div class="container">${titulo(t('visitas_titulo'))}
    <p class="text-center mb-4">${t('visitas_sub')}</p><div class="row g-4 justify-content-center">${vis}</div>
    <div class="text-center mt-4"><a class="btn btn-outline-secondary" href="cultura.html#visitas">${t('visitas_btn')}</a></div>
  </div></section>
  <section class="cta-band"><div class="container text-center">
    <h2>${t('cta_titulo')}</h2><p class="lead">${t('cta_texto')}</p>
    <a class="btn btn-claro btn-lg" target="_blank" rel="noopener" href="${wsp(t('wsp_msg'))}">${t('cta_btn')}</a>
  </div></section>`;
}

function vistaCatalogo() {
  return `${cabeceraPagina(t('cat_titulo'), 'portada-catalogo.jpg')}
  <section class="seccion"><div class="container">
    <div id="aviso" class="alert alert-warning d-none" role="alert"></div>
    <div class="row justify-content-center mb-3"><div class="col-md-8 col-lg-6">
      <label for="buscar" class="visually-hidden">${t('buscar')}</label>
      <input id="buscar" type="search" class="form-control form-control-lg" placeholder="${t('buscar_ph')}" value="${esc(busqueda)}" autocomplete="off">
    </div></div>
    <div id="filtros" class="d-flex flex-wrap gap-2 justify-content-center mb-3" role="group" aria-label="${t('nav_catalogo')}"></div>
    <p id="contador" class="text-center text-muted small" aria-live="polite"></p>
    <div id="productos" class="row g-4"></div>
  </div></section>`;
}

function vistaCultura() {
  const huila = S.huila.map(h => `<div class="col-md-6 col-lg-4"><article class="tfoto h-100">
      ${foto(h.foto, T(h.titulo))}<div class="p-3"><h3 class="h5">${esc(T(h.titulo))}</h3><p class="mb-0">${esc(T(h.texto))}</p></div></article></div>`).join('');
  const b = S.bambuco;
  const vis = S.visitas.map(v => figVisita(v, 'col-6 col-lg-4')).join('');
  const mesa = S.mesa.map(m => `<div class="col-sm-6 col-lg-3"><article class="tfoto h-100">
      ${foto(m.foto, T(m.titulo))}<div class="p-3"><h3 class="h6">${esc(T(m.titulo))}</h3><p class="mb-0 small">${esc(T(m.texto))}</p></div></article></div>`).join('');
  return `${cabeceraPagina(t('cultura_titulo'), 'portada-cultura.jpg')}
  <section class="seccion"><div class="container">
    <p class="lead text-center mx-auto intro-ancha mb-5">${t('cultura_intro')}</p>
    <div id="aviso" class="alert alert-warning d-none" role="alert"></div>
    <div class="row g-4 gy-4 align-items-center">
      <div class="col-lg-6">${videoHtml()}<p class="small text-muted mt-2 mb-0">${t('video_desc')}</p></div>
      <div class="col-lg-6" id="historia-texto"><span class="chip">${t('hist_chip')}</span><h2 class="titulo-izq">${t('hist_titulo')}</h2><p class="lead">${t('hist_texto')}</p></div>
    </div>
  </div></section>
  <section class="frase-band"><div class="container"><p>${esc(T(S.fraseCultura))}</p></div></section>
  <section class="seccion"><div class="container">${titulo(t('huila_titulo'))}
    <p class="text-center mb-4">${t('huila_intro')}</p><div class="row g-4 justify-content-center">${huila}</div></div></section>
  <section class="seccion seccion-oscura"><div class="container"><div class="row g-4 gy-4 align-items-center">
    <div class="col-lg-6"><h2 class="titulo-izq">${esc(T(b.titulo))}</h2>${T(b.textos).map(p => `<p class="lead">${esc(p)}</p>`).join('')}</div>
    <div class="col-lg-6">${foto(b.foto, T(b.titulo), 'foto-redonda')}</div>
  </div></div></section>
  <section class="seccion seccion-alterna" id="visitas"><div class="container">${titulo(t('visitas_titulo'))}
    <p class="text-center mb-4">${t('visitas_sub')}</p><div class="row g-4 justify-content-center">${vis}</div></div></section>
  <section class="seccion"><div class="container">${titulo(t('mesa_titulo'))}
    <div id="mesa-texto" class="text-center mx-auto intro-ancha mb-4"><p>${t('mesa_intro')}</p></div><div class="row g-4">${mesa}</div></div></section>
  <section class="cta-band"><div class="container text-center"><h2>${t('cta_titulo')}</h2>
    <a class="btn btn-claro btn-lg mt-2" href="catalogo.html">${t('hero_btn')}</a></div></section>`;
}

function vistaProceso() {
  const ingr = T(S.ingredientes).map(i => `<li>${esc(i)}</li>`).join('');
  const pasos = S.pasos.map((p, i) => `<div class="col-sm-6 col-lg-4"><article class="paso h-100">
      <div class="paso-media">${p.foto ? foto(p.foto, T(p.t)) : `<div class="paso-sin" aria-hidden="true">${i + 1}</div>`}
        <span class="num"><span class="visually-hidden">${t('paso')} </span>${i + 1}</span></div>
      <div class="p-3"><h3 class="h5">${esc(T(p.t))}</h3><p class="mb-0">${esc(T(p.d))}</p></div></article></div>`).join('');
  return `${cabeceraPagina(t('proceso_titulo'), 'portada-proceso.jpg')}
  <section class="seccion"><div class="container">
    <p id="intro-proceso" class="lead text-center mx-auto intro-ancha">${t('proceso_intro')}</p>
    <div id="aviso" class="alert alert-warning d-none" role="alert"></div>
    <h2 class="h4 text-center mt-4">${t('ingr_titulo')}</h2><ul class="ingredientes">${ingr}</ul>
  </div></section>
  <section class="seccion seccion-alterna"><div class="container">${titulo(t('pasos_titulo'))}<div class="row g-4">${pasos}</div></div></section>
  <section class="cta-band"><div class="container text-center"><h2>${t('cta_titulo')}</h2>
    <a class="btn btn-claro btn-lg mt-2" href="catalogo.html">${t('hero_btn')}</a></div></section>`;
}

function vistaPuntos() {
  return `${cabeceraPagina(t('puntos_titulo'), 'portada-puntos.jpg')}
  <section class="seccion"><div class="container">
    <p class="lead text-center mx-auto intro-ancha">${t('puntos_intro')}</p>
    <div id="aviso" class="alert alert-warning d-none" role="alert"></div>
    <div id="puntos" class="row g-4 mt-1"></div>
  </div></section>
  <section class="seccion seccion-alterna"><div class="container">${titulo(t('mapa_titulo'))}
    <div id="mapaBtns" class="d-flex flex-wrap gap-2 justify-content-center mb-3" role="group" aria-label="${t('mapa_titulo')}"></div>
    <div id="mapa" class="ratio ratio-16x9 mapa-caja"></div>
  </div></section>
  <section class="seccion"><div class="container intro-ancha mx-auto">${titulo(t('faq_titulo'))}
    <div class="accordion" id="faq">${[1, 2, 3, 4, 5].map(i => `
      <div class="accordion-item"><h3 class="accordion-header"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
        data-bs-target="#faq${i}" aria-expanded="false" aria-controls="faq${i}">${t('faq_q' + i)}</button></h3>
        <div id="faq${i}" class="accordion-collapse collapse" data-bs-parent="#faq"><div class="accordion-body">${t('faq_a' + i)}</div></div></div>`).join('')}
    </div></div></section>`;
}

function vistaCarrito() {
  return `${cabeceraPagina(t('carrito_titulo'), 'portada-catalogo.jpg')}
  <section class="seccion"><div class="container">
    <div id="carritoVacio" class="text-center d-none"><p>${t('carrito_vacio')}</p><a class="btn btn-ladrillo" href="catalogo.html">${t('ir_catalogo')}</a></div>
    <div id="carritoContenido" class="d-none">
      <div class="table-responsive"><table class="table align-middle bg-white">
        <caption class="visually-hidden">${t('carrito_titulo')}</caption>
        <thead><tr><th scope="col">${t('col_producto')}</th><th scope="col">${t('col_precio')}</th><th scope="col">${t('col_cant')}</th>
          <th scope="col">${t('col_sub')}</th><th scope="col"><span class="visually-hidden">${t('quitar')}</span></th></tr></thead>
        <tbody id="carritoFilas"></tbody></table></div>
      <div class="row g-4 mt-1">
        <div class="col-lg-7"><div class="card p-3"><h2 class="h5">${t('tus_datos')}</h2>
          <div class="row g-3">
            <div class="col-md-6"><label for="cliNombre" class="form-label">${t('f_nombre')} <span class="text-danger" aria-hidden="true">*</span></label>
              <input id="cliNombre" class="form-control" autocomplete="name" required></div>
            <div class="col-md-6"><label for="cliCiudad" class="form-label">${t('f_ciudad')}</label><input id="cliCiudad" class="form-control" autocomplete="address-level2"></div>
            <div class="col-12"><label for="cliNotas" class="form-label">${t('f_notas')}</label><textarea id="cliNotas" class="form-control" rows="2"></textarea></div>
          </div><div id="errorPedido" class="text-danger mt-2 d-none" role="alert">${t('f_obligatorio')}</div></div></div>
        <div class="col-lg-5 text-lg-end">
          <p class="fs-4 mb-2"><span>${t('total')}</span>: <strong id="carritoTotal" class="precio"></strong></p>
          <button id="btnEnviar" type="button" class="btn btn-ladrillo btn-lg">${t('enviar')}</button>
          <div class="mt-2"><button id="btnVaciar" type="button" class="btn btn-outline-secondary btn-sm">${t('vaciar')}</button></div>
          <p class="small mt-3">${t('nota_pedido')}</p>
        </div>
      </div>
    </div>
  </div></section>`;
}

const VISTAS = { index: vistaIndex, catalogo: vistaCatalogo, cultura: vistaCultura, proceso: vistaProceso, puntos: vistaPuntos, carrito: vistaCarrito };

/* ---------- Partes que dependen de datos del servidor ---------- */
function renderFiltros() {
  let h = `<button type="button" class="btn btn-filtro ${categoriaActiva === null ? 'activo' : ''}" data-id="">${t('cat_todos')}</button>`;
  categorias.forEach(c => {
    h += `<button type="button" class="btn btn-filtro ${categoriaActiva === c.id ? 'activo' : ''}" data-id="${c.id}">${esc(campo(c, 'nombre'))}</button>`;
  });
  $('#filtros').html(h);
}

function tarjetaProducto(p, conDetalle) {
  const licor = esLicor(p) ? `<span class="badge-18">${t('solo_mayores')}</span>` : '';
  return `<article class="card tarjeta-producto h-100">
    <div class="media-prod"${p.imagenUrl ? ` style="--img: url('${esc(p.imagenUrl)}')"` : ''}>${imagen(p.imagenUrl, campo(p, 'nombre'), 'img-prod')}${licor}</div>
    <div class="card-body d-flex flex-column">
      <${conDetalle ? 'h2' : 'h3'} class="h5 card-title">${esc(campo(p, 'nombre'))}</${conDetalle ? 'h2' : 'h3'}>
      ${conDetalle ? `<p class="card-desc">${esc(campo(p, 'descripcion') || '')}</p>` : ''}
      <p class="precio mb-3">${precio(p.precio)}</p>
      <div class="mt-auto d-grid gap-2">
        <button type="button" class="btn btn-ladrillo btn-agregar" data-id="${p.id}">${t('agregar')}</button>
        ${conDetalle ? `<button type="button" class="btn btn-outline-secondary btn-detalle" data-id="${p.id}">${t('ver_detalle')}</button>` : ''}
      </div>
    </div></article>`;
}

function renderProductos() {
  const q = norm(busqueda);
  const lista = productos.filter(p =>
    (categoriaActiva === null || (p.categoria && p.categoria.id === categoriaActiva)) &&
    (!q || norm(p.nombre + ' ' + (p.nombreEn || '') + ' ' + (p.descripcion || '')).includes(q)));
  $('#contador').text(`${lista.length} ${t('n_productos')}`);
  if (!lista.length) { $('#productos').html(`<p class="text-center">${t('sin_resultados')}</p>`); return; }
  $('#productos').html(lista.map(p => `<div class="col-12 col-sm-6 col-lg-4">${tarjetaProducto(p, true)}</div>`).join(''));
}

let carruselN = 0;
function porSlide() { return window.innerWidth >= 992 ? 3 : (window.innerWidth >= 576 ? 2 : 1); }
function renderDestacados() {
  let lista = productos.filter(p => p.imagenUrl).slice(0, 9);
  if (!lista.length) lista = productos.slice(0, 9);
  if (!lista.length) { $('#destacados').html(`<p class="text-center">${t('sin_datos')}</p>`); return; }
  carruselN = porSlide();
  const grupos = [];
  for (let i = 0; i < lista.length; i += carruselN) grupos.push(lista.slice(i, i + carruselN));
  const slides = grupos.map((g, i) => `<div class="carousel-item ${i === 0 ? 'active' : ''}">
      <div class="row g-4 px-md-5">${g.map(p => `<div class="col">${tarjetaProducto(p, false)}</div>`).join('')}</div></div>`).join('');
  const varios = grupos.length > 1;
  const puntosC = varios ? `<div class="carousel-indicators">${grupos.map((g, i) => `
      <button type="button" data-bs-target="#carruselDest" data-bs-slide-to="${i}" ${i === 0 ? 'class="active" aria-current="true"' : ''}
        aria-label="${t('carr_ir')} ${i + 1}"></button>`).join('')}</div>` : '';
  const controles = varios ? `
    <button class="carousel-control-prev" type="button" data-bs-target="#carruselDest" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">${t('carr_ant')}</span></button>
    <button class="carousel-control-next" type="button" data-bs-target="#carruselDest" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">${t('carr_sig')}</span></button>` : '';
  const pausa = varios ? `<div class="text-center mt-2"><button id="btnPausaCarrusel" type="button"
      class="btn btn-sm btn-outline-secondary" data-estado="activo">${t('carr_pausa')}</button></div>` : '';
  $('#destacados').html(`<div id="carruselDest" class="carousel slide" role="region" aria-roledescription="carrusel" aria-label="${t('carr_label')}">
      <div class="carousel-inner">${slides}</div>${controles}${puntosC}</div>${pausa}`);
  if (varios) {
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    bootstrap.Carousel.getOrCreateInstance(document.getElementById('carruselDest'), { interval: 4500, ride: reducir ? false : 'carousel' });
    if (reducir) $('#btnPausaCarrusel').attr('data-estado', 'pausado').text(t('carr_play'));
  }
}

function renderContenidoCultura() {
  const h = cultura[0];
  if (h) {
    $('#historia-texto').html(`<span class="chip">${t('hist_chip')}</span><h2 class="titulo-izq">${esc(campo(h, 'titulo'))}</h2>
      <div class="texto-historia">${parrafos(campo(h, 'texto'))}</div>`);
  }
  const resto = cultura.slice(1);
  if (resto.length) $('#mesa-texto').html(resto.map(c => parrafos(campo(c, 'texto'))).join(''));
}
function renderIntroProceso() {
  const c = proceso[0];
  if (!c) return;
  const primero = String(campo(c, 'texto') || '').split(/\n+/)[0];
  if (primero) $('#intro-proceso').text(primero.replace(/:\s*$/, '.'));
}

function renderPuntos() {
  if (!puntos.length) { $('#puntos').html(`<p class="text-center">${t('sin_datos')}</p>`); return; }
  $('#puntos').html(puntos.map(p => {
    const ex = S.puntos[p.id] || {};
    const wn = telWsp(p.telefono);
    const mapa = encodeURIComponent(ex.mapa || `${p.direccion}, ${p.ciudad}`);
    return `<div class="col-md-6 col-lg-4"><article class="punto-card h-100">
      ${foto(ex.foto || 'placeholder.jpg', p.nombre)}
      <div class="p-3 d-flex flex-column">
        <h2 class="h5">${esc(p.nombre)}</h2>
        <p class="mb-1">${esc(p.direccion)}, ${esc(p.ciudad)}</p>
        ${p.telefono ? `<p class="mb-1"><strong>${t('tel')}:</strong> ${esc(p.telefono)}</p>` : ''}
        ${p.horario ? `<p class="mb-2"><strong>${t('horario')}:</strong> ${esc(p.horario)}</p>` : ''}
        <div class="d-flex flex-wrap gap-2 mt-auto">
          ${p.telefono ? `<a class="btn btn-sm btn-ladrillo" href="tel:+${telWsp(p.telefono)}">${t('llamar')}</a>` : ''}
          ${wn ? `<a class="btn btn-sm btn-outline-secondary" target="_blank" rel="noopener" href="${wsp(t('wsp_msg'), wn)}">${t('whatsapp')}</a>` : ''}
          <a class="btn btn-sm btn-outline-secondary" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${mapa}">${t('como_llegar')}</a>
        </div></div></article></div>`;
  }).join(''));
  if (puntoActivo >= puntos.length) puntoActivo = 0;
  $('#mapaBtns').html(puntos.map((p, i) => `<button type="button" class="btn btn-filtro btn-mapa ${i === puntoActivo ? 'activo' : ''}" data-i="${i}">${esc(p.nombre)}</button>`).join(''));
  pintarMapa();
}
function pintarMapa() {
  const p = puntos[puntoActivo];
  if (!p) return;
  const ex = S.puntos[p.id] || {};
  const q = encodeURIComponent(ex.mapa || `${p.direccion}, ${p.ciudad}`);
  $('#mapa').html(`<iframe src="https://www.google.com/maps?q=${q}&output=embed" title="${esc(t('mapa_titulo'))}: ${esc(p.nombre)}"
    loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`);
}

function renderDatos() {
  if (PAGINA === 'index') renderDestacados();
  if (PAGINA === 'catalogo') { renderFiltros(); renderProductos(); }
  if (PAGINA === 'cultura') renderContenidoCultura();
  if (PAGINA === 'proceso') renderIntroProceso();
  if (PAGINA === 'puntos') renderPuntos();
  if (PAGINA === 'carrito') renderCarrito();
}

function abrirDetalle(id) {
  const p = productos.find(x => x.id === id);
  if (!p) return;
  $('#modalTitulo').text(campo(p, 'nombre'));
  $('#modalCuerpo').html(`
    <div class="row g-3">
      <div class="col-md-5"><div class="media-prod"${p.imagenUrl ? ` style="--img: url('${esc(p.imagenUrl)}')"` : ''}>${imagen(p.imagenUrl, campo(p, 'nombre'), 'img-prod')}</div></div>
      <div class="col-md-7">
        ${p.categoria ? `<p class="text-muted mb-1">${esc(campo(p.categoria, 'nombre'))}</p>` : ''}
        ${esLicor(p) ? `<p><span class="badge-18 static">${t('solo_mayores')}</span></p>` : ''}
        <p>${esc(campo(p, 'descripcion'))}</p>
        <p class="precio fs-4">${precio(p.precio)}</p>
        <div class="d-flex flex-wrap gap-2">
          <button type="button" class="btn btn-ladrillo btn-agregar" data-id="${p.id}">${t('agregar')}</button>
          <a class="btn btn-outline-secondary" target="_blank" rel="noopener" href="${wsp(t('wsp_prod') + ' ' + campo(p, 'nombre'))}">${t('pedir')}</a>
        </div>
      </div>
    </div>`);
  bootstrap.Modal.getOrCreateInstance(document.getElementById('modalProducto')).show();
}

/* ---------- Menú, pie de página y botón de WhatsApp ---------- */
function pintarLayout() {
  if (PAGINA === 'index') {
    $('#cabecera').before(`<div class="banner"><a href="index.html"><img src="img/logo.png" alt="${esc(S.nombre)}"></a></div>`);
  }
  $('#cabecera').html(`
    <nav class="navbar navbar-expand-lg navbar-bizcocho" aria-label="Principal">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" href="index.html">
          <img src="img/logotipo.png" alt="" class="logo-nav"><span>${esc(S.nombre)}</span></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu"
                aria-controls="menu" aria-expanded="false" aria-label="Menú"><span class="navbar-toggler-icon"></span></button>
        <div class="collapse navbar-collapse" id="menu">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0" id="navItems"></ul>
          <div class="d-flex align-items-center gap-3">
            <div class="selector-idioma" role="group" aria-label="Idioma / Language">
              ${IDIOMAS.map(([c, ab, nom]) => `<button type="button" class="btn-lang" data-lang="${c}" lang="${c}" aria-label="${nom}">${ab}</button>`).join('<span aria-hidden="true">|</span>')}
            </div>
            <a id="btnCarrito" class="btn btn-outline-light btn-sm" href="carrito.html">
              <span aria-hidden="true">🛒</span> <span id="cartCount" class="badge text-bg-warning">0</span></a>
          </div>
        </div>
      </div>
    </nav>`);
  $('body').append('<div id="toastCarrito" class="toast-carrito" role="status" aria-live="polite"></div>');
  $('body').append(`<a id="wspFlot" class="wsp-flotante" target="_blank" rel="noopener" href="#">
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/></svg>
    <span id="wspFlotTxt"></span></a>`);
  $('#pie').addClass('pie').html('<div id="pieInterior"></div>');
}

function pintarPie() {
  const c = S.contacto;
  const redes = Object.entries(S.redes).filter(([, u]) => u).map(([k, u]) =>
    `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(k.charAt(0).toUpperCase() + k.slice(1))}</a></li>`).join('');
  const links = NAV.map(([, href, key]) => `<li><a href="${href}">${t(key)}</a></li>`).join('');
  $('#pieInterior').html(`<div class="container"><div class="row g-4 py-4">
    <div class="col-md-4"><p class="pie-marca">${esc(S.nombre)}</p><p class="small mb-0">${t('hero_pre')}.</p></div>
    <div class="col-6 col-md-3"><h2 class="pie-t">${t('foot_ir')}</h2><ul class="list-unstyled mb-0">${links}</ul></div>
    <div class="col-6 col-md-5"><h2 class="pie-t">${t('foot_contacto')}</h2>
      <p class="mb-1">${esc(T(c.direccion))}</p>
      <p class="mb-1">${c.telefonos.map(n => `<a href="tel:+57${n}">${esc(n)}</a>`).join(' · ')}</p>
      ${c.correo ? `<p class="mb-1"><a href="mailto:${esc(c.correo)}">${esc(c.correo)}</a></p>` : ''}
      <p class="mb-2">${esc(T(c.horario))}</p>
      ${redes ? `<h2 class="pie-t">${t('foot_sigue')}</h2><ul class="list-inline mb-0">${redes.replace(/<li>/g, '<li class="list-inline-item">')}</ul>` : ''}
    </div></div>
    <p class="text-center small pie-copy mb-0">© ${new Date().getFullYear()} ${esc(S.nombre)}. ${t('foot_derechos')} · <a href="admin.html">${t('nav_admin')}</a></p></div>`);
}

function aplicarIdioma() {
  document.documentElement.lang = idioma;
  document.title = t(TITULO_PAG[PAGINA]) + ' | ' + S.nombre;
  $('#navItems').html(NAV.map(([k, href, key]) => `<li class="nav-item"><a class="nav-link ${PAGINA === k ? 'active' : ''}" ${PAGINA === k ? 'aria-current="page"' : ''} href="${href}">${t(key)}</a></li>`).join(''));
  $('.btn-lang').each(function () {
    const activo = $(this).data('lang') === idioma;
    $(this).toggleClass('activo', activo).attr('aria-pressed', activo);
  });
  $('.skip-link').text(t('skip'));
  $('nav.navbar').attr('aria-label', t('nav_principal'));
  $('.navbar-toggler').attr('aria-label', t('menu'));
  $('.selector-idioma').attr('aria-label', t('idioma_label'));
  $('#wspFlot').attr('href', wsp(t('wsp_msg')));
  $('#wspFlotTxt').text(t('wsp_flot'));
  $('#contenido').html(VISTAS[PAGINA]());
  pintarPie();
  actualizarBadge();
  renderDatos();
}

function cargar(url, guardar) {
  $.getJSON(url).done(d => { guardar(d); renderDatos(); })
    .fail(() => $('#aviso').removeClass('d-none').text(t('error')));
}
const CARGAS = {
  index: [['/api/productos', d => productos = d]],
  catalogo: [['/api/categorias', d => categorias = d], ['/api/productos', d => productos = d]],
  cultura: [['/api/contenidos?tipo=CULTURA', d => cultura = d]],
  proceso: [['/api/contenidos?tipo=PROCESO', d => proceso = d]],
  puntos: [['/api/puntos-venta', d => puntos = d]]
};

/* Pide al servidor los textos del idioma elegido  */
function cargarMensajes(lang) {
  return $.getJSON('/api/i18n/mensajes', { lang: lang }).done(m => { MSG = m; });
}

$(function () { cargarMensajes(idioma).always(iniciar); });

function iniciar() {
  pintarLayout();

  $(document).on('click', '.btn-lang', function () {
    const nuevo = $(this).data('lang');
    if (nuevo === idioma) return;
    cargarMensajes(nuevo).done(() => {
      idioma = nuevo;
      try { localStorage.setItem('idioma', idioma); } catch (e) { }
      aplicarIdioma();
    });
  });
  $(document).on('click', '#filtros .btn-filtro', function () {
    const id = $(this).attr('data-id');
    categoriaActiva = id ? Number(id) : null;
    renderFiltros(); renderProductos();
  });
  $(document).on('input', '#buscar', function () { busqueda = $(this).val(); renderProductos(); });
  $(document).on('click', '.btn-mapa', function () {
    puntoActivo = Number($(this).data('i'));
    $('.btn-mapa').removeClass('activo').eq(puntoActivo).addClass('activo');
    pintarMapa();
  });
  $(document).on('click', '.btn-detalle', function () { abrirDetalle(Number($(this).data('id'))); });
  $(document).on('click', '.btn-agregar', function () { agregarAlCarrito(Number($(this).data('id'))); });
  $(document).on('click', '.btn-mas', function () { cambiarCantidad(Number($(this).data('id')), 1); });
  $(document).on('click', '.btn-menos', function () { cambiarCantidad(Number($(this).data('id')), -1); });
  $(document).on('click', '.btn-quitar', function () { quitarDelCarrito(Number($(this).data('id'))); });
  $(document).on('click', '#btnVaciar', function () { guardarCarrito([]); renderCarrito(); });
  $(document).on('click', '#btnEnviar', function () {
    if (!$('#cliNombre').val().trim()) { $('#errorPedido').removeClass('d-none'); $('#cliNombre').trigger('focus'); return; }
    $('#errorPedido').addClass('d-none');
    window.open(wsp(mensajePedido()), '_blank', 'noopener');
  });
  $(document).on('click', '#btnPausaCarrusel', function () {
    const c = bootstrap.Carousel.getOrCreateInstance(document.getElementById('carruselDest'));
    if ($(this).attr('data-estado') === 'activo') { c.pause(); $(this).attr('data-estado', 'pausado').text(t('carr_play')); }
    else { c.cycle(); $(this).attr('data-estado', 'activo').text(t('carr_pausa')); }
  });
  let tmResize;
  $(window).on('resize', function () {
    clearTimeout(tmResize);
    tmResize = setTimeout(() => { if (PAGINA === 'index' && porSlide() !== carruselN) renderDestacados(); }, 250);
  });

  aplicarIdioma();
  (CARGAS[PAGINA] || []).forEach(([url, guardar]) => cargar(url, guardar));
  if (location.hash) setTimeout(() => { try { const el = document.querySelector(location.hash); if (el) el.scrollIntoView(); } catch (e) { } }, 400);
}
