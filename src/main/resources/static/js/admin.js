/* Panel administrativo: inicio de sesión con JWT y CRUD de los 4 módulos */

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

const MODULOS = {
  productos: {
    titulo: 'Productos', singular: 'producto',
    lista: '/api/admin/productos', base: '/api/productos',
    cols: [
      { t: 'Nombre', f: r => r.nombre },
      { t: 'Precio', f: r => fmt(r.precio) },
      { t: 'Categoría', f: r => r.categoria ? r.categoria.nombre : '—' },
      { t: 'Visible', f: r => r.activo ? 'Sí' : 'No' }
    ],
    campos: [
      { n: 'nombre', l: 'Nombre (español)', req: true },
      { n: 'nombreEn', l: 'Nombre (inglés)' },
      { n: 'nombreFr', l: 'Nombre (francés)' },
      { n: 'descripcion', l: 'Descripción (español)', tipo: 'textarea' },
      { n: 'descripcionEn', l: 'Descripción (inglés)', tipo: 'textarea' },
      { n: 'descripcionFr', l: 'Descripción (francés)', tipo: 'textarea' },
      { n: 'precio', l: 'Precio en pesos (COP)', tipo: 'number', req: true },
      { n: 'imagenUrl', l: 'Imagen (ruta, por ejemplo /img/bizcocho-achira.jpg)' },
      { n: 'categoriaId', l: 'Categoría', tipo: 'select', opciones: 'categorias' },
      { n: 'activo', l: 'Visible en el catálogo', tipo: 'checkbox', def: true }
    ],
    desdeRegistro: r => ({ ...r, categoriaId: r.categoria ? r.categoria.id : '' }),
    haciaApi: v => {
      const { categoriaId, ...resto } = v;
      return { ...resto, categoria: categoriaId ? { id: Number(categoriaId) } : null };
    }
  },
  categorias: {
    titulo: 'Categorías', singular: 'categoría',
    lista: '/api/categorias', base: '/api/categorias',
    cols: [
      { t: 'Nombre', f: r => r.nombre },
      { t: 'Nombre (inglés)', f: r => r.nombreEn || '—' },
      { t: 'Descripción', f: r => r.descripcion || '—' }
    ],
    campos: [
      { n: 'nombre', l: 'Nombre (español)', req: true },
      { n: 'nombreEn', l: 'Nombre (inglés)' },
      { n: 'nombreFr', l: 'Nombre (francés)' },
      { n: 'descripcion', l: 'Descripción' }
    ]
  },
  puntos: {
    titulo: 'Puntos de venta', singular: 'punto de venta',
    lista: '/api/puntos-venta', base: '/api/puntos-venta',
    cols: [
      { t: 'Nombre', f: r => r.nombre },
      { t: 'Dirección', f: r => r.direccion },
      { t: 'Ciudad', f: r => r.ciudad },
      { t: 'Teléfono', f: r => r.telefono || '—' }
    ],
    campos: [
      { n: 'nombre', l: 'Nombre', req: true },
      { n: 'direccion', l: 'Dirección', req: true },
      { n: 'ciudad', l: 'Ciudad', req: true },
      { n: 'telefono', l: 'Teléfono' },
      { n: 'horario', l: 'Horario de atención' }
    ]
  },
  contenido: {
    titulo: 'Contenido (cultura y proceso)', singular: 'contenido',
    lista: '/api/contenidos', base: '/api/contenidos',
    cols: [
      { t: 'Tipo', f: r => r.tipo === 'CULTURA' ? 'Cultura' : 'Proceso' },
      { t: 'Título', f: r => r.titulo },
      { t: 'Imagen', f: r => r.imagenUrl || '—' }
    ],
    campos: [
      { n: 'tipo', l: 'Tipo de contenido', tipo: 'select', req: true,
        opciones: [['CULTURA', 'Cultura del Huila'], ['PROCESO', 'Proceso de fabricación']] },
      { n: 'titulo', l: 'Título (español)', req: true },
      { n: 'tituloEn', l: 'Título (inglés)' },
      { n: 'tituloFr', l: 'Título (francés)' },
      { n: 'texto', l: 'Texto (español)', tipo: 'textarea', req: true },
      { n: 'textoEn', l: 'Texto (inglés)', tipo: 'textarea' },
      { n: 'textoFr', l: 'Texto (francés)', tipo: 'textarea' },
      { n: 'imagenUrl', l: 'Imagen (ruta, por ejemplo /img/proceso.jpg)' }
    ]
  }
};

let token = null, nombreUsuario = '';
try { token = sessionStorage.getItem('token'); nombreUsuario = sessionStorage.getItem('nombre') || ''; } catch (e) { }
let actual = 'productos', datos = [], categoriasCache = [], editandoId = null;

/* ---------- Utilidades ---------- */
function mensaje(texto, tipo) {
  $('#alerta').attr('class', 'alert alert-' + (tipo || 'success')).text(texto);
  clearTimeout(mensaje.tm);
  mensaje.tm = setTimeout(() => $('#alerta').addClass('d-none'), 4500);
}

async function api(url, opciones) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const r = await fetch(url, { ...(opciones || {}), headers });
  if (r.status === 401 && token) {
    cerrarSesion('Su sesión expiró. Inicie sesión de nuevo.');
    throw new Error('sesion');
  }
  return r;
}

/* ---------- Sesión ---------- */
function mostrarPanel() {
  $('#vistaLogin').addClass('d-none');
  $('#vistaPanel').removeClass('d-none');
  $('#nombreUsuario').text(nombreUsuario);
  pintarTabs();
  cargarCategorias().then(cargarLista);
}

function cerrarSesion(aviso) {
  token = null; nombreUsuario = '';
  try { sessionStorage.removeItem('token'); sessionStorage.removeItem('nombre'); } catch (e) { }
  $('#vistaPanel').addClass('d-none');
  $('#vistaLogin').removeClass('d-none');
  if (aviso) $('#errorLogin').removeClass('d-none').text(aviso);
}

/* ---------- Lista ---------- */
function pintarTabs() {
  $('#tabs').html(Object.entries(MODULOS).map(([k, m]) => `
    <li class="nav-item"><button type="button" class="nav-link ${k === actual ? 'active' : ''}" data-mod="${k}"
      ${k === actual ? 'aria-current="page"' : ''}>${esc(m.titulo)}</button></li>`).join(''));
}

async function cargarCategorias() {
  try {
    const r = await api('/api/categorias');
    if (r.ok) categoriasCache = await r.json();
  } catch (e) { }
}

async function cargarLista() {
  const m = MODULOS[actual];
  $('#tituloModulo').text(m.titulo);
  $('#captionTabla').text('Lista de ' + m.titulo);
  try {
    const r = await api(m.lista);
    if (!r.ok) throw new Error('lista');
    datos = await r.json();
    pintarTabla();
  } catch (e) {
    if (e.message !== 'sesion') mensaje('No se pudo cargar la lista.', 'danger');
  }
}

function pintarTabla() {
  const m = MODULOS[actual];
  $('#tablaHead').html('<tr>' + m.cols.map(c => `<th scope="col">${esc(c.t)}</th>`).join('') +
    '<th scope="col" class="text-end">Acciones</th></tr>');
  if (!datos.length) {
    $('#tablaBody').html(`<tr><td colspan="${m.cols.length + 1}" class="text-center text-muted py-4">No hay registros. Use «+ Nuevo» para crear el primero.</td></tr>`);
    return;
  }
  $('#tablaBody').html(datos.map(r => `<tr>
    ${m.cols.map(c => `<td>${esc(c.f(r))}</td>`).join('')}
    <td class="text-end text-nowrap">
      <button type="button" class="btn btn-sm btn-outline-secondary btn-editar" data-id="${r.id}">Editar</button>
      <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${r.id}">Eliminar</button>
    </td></tr>`).join(''));
}

/* ---------- Formulario ---------- */
function campoHtml(c, valor) {
  const id = 'f_' + c.n;
  const req = c.req ? ' required' : '';
  const marca = c.req ? ' <span class="text-danger" aria-hidden="true">*</span>' : '';
  if (c.tipo === 'checkbox') {
    return `<div class="form-check mb-3"><input class="form-check-input" type="checkbox" id="${id}" ${valor ? 'checked' : ''}>
      <label class="form-check-label" for="${id}">${esc(c.l)}</label></div>`;
  }
  let control;
  if (c.tipo === 'textarea') {
    control = `<textarea id="${id}" class="form-control" rows="4"${req}>${esc(valor)}</textarea>`;
  } else if (c.tipo === 'select') {
    const ops = c.opciones === 'categorias' ? categoriasCache.map(x => [x.id, x.nombre]) : c.opciones;
    const vacio = c.req ? '<option value="">Seleccione…</option>' : '<option value="">— Sin categoría —</option>';
    control = `<select id="${id}" class="form-select"${req}>${vacio}${ops.map(([v, t]) =>
      `<option value="${esc(v)}" ${String(valor) === String(v) ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select>`;
  } else {
    control = `<input id="${id}" class="form-control" type="${c.tipo === 'number' ? 'number' : 'text'}"
      ${c.tipo === 'number' ? 'min="0" step="any"' : ''} value="${esc(valor)}"${req}>`;
  }
  return `<div class="mb-3"><label for="${id}" class="form-label">${esc(c.l)}${marca}</label>${control}</div>`;
}

async function abrirForm(id) {
  const m = MODULOS[actual];
  editandoId = id;
  if (actual === 'productos') await cargarCategorias();
  let valores = {};
  if (id !== null) {
    const reg = datos.find(x => x.id === id);
    valores = m.desdeRegistro ? m.desdeRegistro(reg) : reg;
  } else {
    m.campos.forEach(c => { if ('def' in c) valores[c.n] = c.def; });
  }
  $('#modalFormTitulo').text((id === null ? 'Nuevo ' : 'Editar ') + m.singular);
  $('#errorForm').addClass('d-none');
  $('#camposForm').html(m.campos.map(c => campoHtml(c, valores[c.n] ?? '')).join(''));
  bootstrap.Modal.getOrCreateInstance(document.getElementById('modalForm')).show();
}

async function guardar(ev) {
  ev.preventDefault();
  const m = MODULOS[actual];
  const v = {};
  for (const c of m.campos) {
    const el = $('#f_' + c.n);
    if (c.tipo === 'checkbox') v[c.n] = el.prop('checked');
    else if (c.tipo === 'number') v[c.n] = el.val() === '' ? null : Number(el.val());
    else { const txt = el.val().trim(); v[c.n] = (txt === '' && !c.req) ? null : txt; }
    if (c.req && (v[c.n] === null || v[c.n] === '')) {
      $('#errorForm').removeClass('d-none').text('Complete el campo obligatorio: ' + c.l + '.');
      el.trigger('focus');
      return;
    }
  }
  const cuerpo = m.haciaApi ? m.haciaApi(v) : v;
  const url = editandoId === null ? m.base : m.base + '/' + editandoId;
  try {
    const r = await api(url, { method: editandoId === null ? 'POST' : 'PUT', body: JSON.stringify(cuerpo) });
    if (r.ok) {
      bootstrap.Modal.getInstance(document.getElementById('modalForm')).hide();
      mensaje(editandoId === null ? 'Registro creado correctamente.' : 'Registro actualizado correctamente.');
      if (actual === 'categorias') await cargarCategorias();
      cargarLista();
    } else if (r.status === 403) {
      $('#errorForm').removeClass('d-none').text('No tiene permisos para esta acción.');
    } else {
      $('#errorForm').removeClass('d-none').text('No se pudo guardar. Revise los datos e intente de nuevo.');
    }
  } catch (e) {
    if (e.message !== 'sesion') $('#errorForm').removeClass('d-none').text('Error de conexión con el servidor.');
  }
}

async function eliminar(id) {
  const m = MODULOS[actual];
  if (!window.confirm('¿Eliminar este ' + m.singular + '? Esta acción no se puede deshacer.')) return;
  try {
    const r = await api(m.base + '/' + id, { method: 'DELETE' });
    if (r.ok) {
      mensaje('Registro eliminado.');
      if (actual === 'categorias') await cargarCategorias();
      cargarLista();
    } else {
      mensaje('No se pudo eliminar. Puede estar en uso (por ejemplo, una categoría que tiene productos).', 'danger');
    }
  } catch (e) {
    if (e.message !== 'sesion') mensaje('Error de conexión con el servidor.', 'danger');
  }
}

/* ---------- Reporte PDF ---------- */
async function descargarReporte() {
  try {
    const r = await api('/api/reportes/productos');
    if (!r.ok) { mensaje('No se pudo generar el reporte.', 'danger'); return; }
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'reporte-productos.pdf';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    mensaje('Reporte generado correctamente.');
  } catch (e) {
    if (e.message !== 'sesion') mensaje('Error de conexión con el servidor.', 'danger');
  }
}

/* ---------- Eventos ---------- */
$(function () {
  $('#formLogin').on('submit', async function (ev) {
    ev.preventDefault();
    $('#errorLogin').addClass('d-none');
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: $('#correo').val().trim(), password: $('#password').val() })
      });
      if (!r.ok) {
        $('#errorLogin').removeClass('d-none').text(r.status === 401 || r.status === 400
          ? 'Correo o contraseña incorrectos.' : 'No se pudo iniciar sesión. Intente de nuevo.');
        return;
      }
      const d = await r.json();
      token = d.token; nombreUsuario = d.nombre;
      try { sessionStorage.setItem('token', token); sessionStorage.setItem('nombre', nombreUsuario); } catch (e) { }
      $('#password').val('');
      mostrarPanel();
    } catch (e) {
      $('#errorLogin').removeClass('d-none').text('Error de conexión con el servidor.');
    }
  });

  $('#btnSalir').on('click', () => cerrarSesion());
  $('#btnReporte').on('click', descargarReporte);
  $('#tabs').on('click', '[data-mod]', function () {
    actual = $(this).data('mod');
    pintarTabs(); cargarLista();
  });
  $('#btnNuevo').on('click', () => abrirForm(null));
  $('#tablaBody').on('click', '.btn-editar', function () { abrirForm(Number($(this).data('id'))); });
  $('#tablaBody').on('click', '.btn-eliminar', function () { eliminar(Number($(this).data('id'))); });
  $('#formRegistro').on('submit', guardar);

  if (token) mostrarPanel();
});
