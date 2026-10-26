// Capa de datos. Si hay credenciales de Supabase en el .env usa la base de datos real;
// si no, funciona en "modo demostración" guardando todo en el navegador (localStorage).
import { createClient } from '@supabase/supabase-js'
import { RUTAS_RESERVADAS } from './config'
import { slugify } from './formato'
import { redimensionarImagen, blobADataUrl } from './imagen'
import * as demo from './datosDemo'

const URL_SB = import.meta.env.VITE_SUPABASE_URL
const KEY_SB = import.meta.env.VITE_SUPABASE_ANON_KEY

export const MODO_DEMO = !URL_SB || !KEY_SB
const sb = MODO_DEMO ? null : createClient(URL_SB, KEY_SB)
const BUCKET = 'productos'

function falla(error) {
  if (error) throw new Error(traducirError(error.message || String(error)))
}

function traducirError(msg) {
  if (/Invalid login credentials/i.test(msg)) return 'Correo o contraseña incorrectos.'
  if (/row-level security|permission denied/i.test(msg)) return 'No tienes permiso para hacer esto. Inicia sesión como administrador.'
  if (/categorias_seccion_fkey/i.test(msg)) return 'No se puede eliminar: todavía hay categorías en esta sección.'
  if (/violates foreign key/i.test(msg)) return 'No se puede eliminar: todavía hay productos en esta categoría.'
  if (/secciones_prefijo_key/i.test(msg)) return 'Ese código de 3 letras ya lo usa otra sección.'
  if (/duplicate key/i.test(msg)) return 'Ya existe un registro con ese nombre.'
  if (/check constraint/i.test(msg)) return 'Revisa los datos: algún campo está vacío o es demasiado largo.'
  if (/Failed to fetch|NetworkError/i.test(msg)) return 'Sin conexión. Revisa tu internet e inténtalo de nuevo.'
  return msg
}

// ---------- Modo demostración (localStorage) ----------
const CLAVE_DEMO = 'daledale-demo-v3'
const CLAVE_SESION_DEMO = 'daledale-demo-sesion'

function leerDemo() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_DEMO))
    if (guardado?.secciones) return guardado
  } catch { /* sin almacenamiento disponible */ }
  return {
    secciones: structuredClone(demo.SECCIONES),
    categorias: structuredClone(demo.CATEGORIAS),
    productos: structuredClone(demo.PRODUCTOS),
    ajustes: { ...demo.AJUSTES },
    consecutivos: {},
  }
}

function escribirDemo(estado) {
  try {
    localStorage.setItem(CLAVE_DEMO, JSON.stringify(estado))
  } catch {
    throw new Error('No se pudo guardar en este navegador (¿almacenamiento lleno o modo privado?).')
  }
}

export function reiniciarDemo() {
  try { localStorage.removeItem(CLAVE_DEMO) } catch { /* nada */ }
}

const nuevoId = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()))

// ---------- Catálogo ----------
export async function obtenerCatalogo() {
  if (MODO_DEMO) {
    const { secciones, categorias, productos } = leerDemo()
    return { secciones, categorias, productos }
  }
  const [secs, cats, prods] = await Promise.all([
    sb.from('secciones').select('*').order('orden'),
    sb.from('categorias').select('*').order('orden'),
    sb.from('productos').select('*').order('codigo'),
  ])
  falla(secs.error)
  falla(cats.error)
  falla(prods.error)
  return { secciones: secs.data, categorias: cats.data, productos: prods.data }
}

export async function guardarProducto(producto) {
  const campos = {
    nombre: producto.nombre.trim(),
    categoria_id: producto.categoria_id,
    precio: Number(producto.precio),
    medida: producto.medida?.trim() || '',
    descripcion: producto.descripcion?.trim() || '',
    imagen_url: producto.imagen_url || '',
    estado: producto.estado,
    destacado: !!producto.destacado,
  }
  if (MODO_DEMO) {
    const estado = leerDemo()
    if (producto.id) {
      estado.productos = estado.productos.map((p) => (p.id === producto.id ? { ...p, ...campos } : p))
    } else {
      const cat = estado.categorias.find((c) => c.id === campos.categoria_id)
      const sec = estado.secciones.find((x) => x.id === cat?.seccion)
      if (!sec) throw new Error('La categoría no pertenece a ninguna sección.')
      sec.consecutivo += 1
      const codigo = `${sec.prefijo}-${String(sec.consecutivo).padStart(4, '0')}`
      estado.productos.push({ id: nuevoId(), codigo, ...campos })
    }
    escribirDemo(estado)
    return
  }
  // El código (PIN-0001, DUL-0001…) lo asigna la base de datos con el prefijo de la sección y no cambia nunca.
  const res = producto.id
    ? await sb.from('productos').update(campos).eq('id', producto.id)
    : await sb.from('productos').insert(campos)
  falla(res.error)
}

export async function cambiarEstadoProducto(id, nuevoEstado) {
  if (MODO_DEMO) {
    const estado = leerDemo()
    estado.productos = estado.productos.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
    escribirDemo(estado)
    return
  }
  falla((await sb.from('productos').update({ estado: nuevoEstado }).eq('id', id)).error)
}

export async function eliminarProducto(producto) {
  if (MODO_DEMO) {
    const estado = leerDemo()
    estado.productos = estado.productos.filter((p) => p.id !== producto.id)
    escribirDemo(estado)
    return
  }
  falla((await sb.from('productos').delete().eq('id', producto.id)).error)
  await borrarImagenPropia(producto.imagen_url)
}

// ---------- Secciones (Piñatas, Dulcería, …) ----------
// El id (usado en la dirección, ej. /dulceria) y el prefijo de 3 letras no cambian después de crearla.
export function idParaSeccion(nombre, existentes) {
  const base = slugify(nombre) || 'seccion'
  let id = RUTAS_RESERVADAS.includes(base) ? `${base}-1` : base
  for (let n = 2; existentes.some((s) => s.id === id); n++) id = `${base}-${n}`
  return id
}

export async function guardarSeccion(seccion, esNueva) {
  const campos = {
    nombre: seccion.nombre.trim(),
    emoji: seccion.emoji?.trim() || '🎉',
    imagen_url: seccion.imagen_url || '',
    orden: Number(seccion.orden) || 0,
    activa: seccion.activa !== false,
  }
  const prefijo = (seccion.prefijo || '').toUpperCase()
  if (esNueva && !/^[A-Z]{3}$/.test(prefijo)) throw new Error('El código debe tener exactamente 3 letras (A-Z).')
  if (esNueva && prefijo === 'PER') throw new Error('PER está reservado para las piñatas personalizadas.')
  if (MODO_DEMO) {
    const estado = leerDemo()
    if (esNueva) {
      if (estado.secciones.some((x) => x.prefijo === prefijo)) throw new Error('Ese código de 3 letras ya lo usa otra sección.')
      estado.secciones.push({ id: seccion.id, prefijo, consecutivo: 0, ...campos })
    } else {
      estado.secciones = estado.secciones.map((x) => (x.id === seccion.id ? { ...x, ...campos } : x))
    }
    escribirDemo(estado)
    return
  }
  const res = esNueva
    ? await sb.from('secciones').insert({ id: seccion.id, prefijo, ...campos })
    : await sb.from('secciones').update(campos).eq('id', seccion.id)
  falla(res.error)
}

export async function eliminarSeccion(id) {
  if (MODO_DEMO) {
    const estado = leerDemo()
    if (estado.categorias.some((c) => c.seccion === id)) {
      throw new Error('No se puede eliminar: todavía hay categorías en esta sección.')
    }
    estado.secciones = estado.secciones.filter((x) => x.id !== id)
    escribirDemo(estado)
    return
  }
  falla((await sb.from('secciones').delete().eq('id', id)).error)
}

// ---------- Categorías (tipos de piñata / tipos de dulce) ----------
export async function guardarCategoria(categoria) {
  const campos = {
    nombre: categoria.nombre.trim(),
    emoji: categoria.emoji?.trim() || '🎉',
    seccion: categoria.seccion,
    orden: Number(categoria.orden) || 0,
    activa: categoria.activa !== false,
    slug: slugify(categoria.nombre),
  }
  if (MODO_DEMO) {
    const estado = leerDemo()
    const repetida = estado.categorias.find((c) => c.slug === campos.slug && c.id !== categoria.id)
    if (repetida) throw new Error('Ya existe una categoría con ese nombre.')
    if (categoria.id) {
      estado.categorias = estado.categorias.map((c) => (c.id === categoria.id ? { ...c, ...campos } : c))
    } else {
      estado.categorias.push({ id: nuevoId(), ...campos })
    }
    escribirDemo(estado)
    return
  }
  const res = categoria.id
    ? await sb.from('categorias').update(campos).eq('id', categoria.id)
    : await sb.from('categorias').insert(campos)
  falla(res.error)
}

export async function eliminarCategoria(id) {
  if (MODO_DEMO) {
    const estado = leerDemo()
    if (estado.productos.some((p) => p.categoria_id === id)) {
      throw new Error('No se puede eliminar: todavía hay productos en esta categoría.')
    }
    estado.categorias = estado.categorias.filter((c) => c.id !== id)
    escribirDemo(estado)
    return
  }
  falla((await sb.from('categorias').delete().eq('id', id)).error)
}

// ---------- Ajustes (WhatsApp, horario, aviso) ----------
export async function obtenerAjustes() {
  if (MODO_DEMO) return leerDemo().ajustes
  const { data, error } = await sb.from('ajustes').select('*').eq('id', 1).maybeSingle()
  falla(error)
  return data || { whatsapp: '', horario: '', ubicacion: '', aviso: '', personalizada_activa: true }
}

export async function guardarAjustes(ajustes) {
  const campos = {
    whatsapp: ajustes.whatsapp?.trim() || '',
    horario: ajustes.horario?.trim() || '',
    ubicacion: ajustes.ubicacion?.trim() || '',
    aviso: ajustes.aviso?.trim() || '',
    personalizada_activa: ajustes.personalizada_activa !== false,
  }
  if (MODO_DEMO) {
    const estado = leerDemo()
    estado.ajustes = campos
    escribirDemo(estado)
    return
  }
  falla((await sb.from('ajustes').upsert({ id: 1, ...campos })).error)
}

// ---------- Piñatas personalizadas ----------
const BUCKET_REFERENCIAS = 'referencias'

// Sube la foto de referencia (si hay) y registra la solicitud. Devuelve { folio, foto_url }.
export async function crearPersonalizada(solicitud) {
  const datos = {
    diseno: solicitud.diseno.trim(),
    tamano: solicitud.tamano,
    detalles: solicitud.detalles?.trim() || '',
    fecha_evento: solicitud.fecha_evento || null,
  }
  let foto_url = ''
  if (solicitud.foto) {
    const blob = await redimensionarImagen(solicitud.foto, { cuadrada: false, lado: 1280 })
    if (MODO_DEMO) {
      foto_url = await blobADataUrl(blob)
    } else {
      const ruta = `${new Date().toISOString().slice(0, 7)}/${nuevoId()}.jpg`
      const { error } = await sb.storage.from(BUCKET_REFERENCIAS).upload(ruta, blob, { contentType: 'image/jpeg' })
      falla(error)
      foto_url = sb.storage.from(BUCKET_REFERENCIAS).getPublicUrl(ruta).data.publicUrl
    }
  }
  if (MODO_DEMO) {
    const estado = leerDemo()
    estado.personalizadas ??= []
    estado.consecutivos.PER = (estado.consecutivos.PER || 0) + 1 // folios propios, aparte de las secciones
    const folio = `PER-${String(estado.consecutivos.PER).padStart(4, '0')}`
    estado.personalizadas.unshift({
      id: nuevoId(), folio, estado: 'nuevo', created_at: new Date().toISOString(), con_foto: !!foto_url, foto_url, ...datos,
    })
    escribirDemo(estado)
    return { folio, foto_url: foto_url && 'foto-en-modo-demo' }
  }
  const { data, error } = await sb.rpc('crear_personalizada', {
    p_diseno: datos.diseno,
    p_tamano: datos.tamano,
    p_detalles: datos.detalles,
    p_fecha_evento: datos.fecha_evento,
    p_foto_url: foto_url,
  })
  falla(error)
  return { folio: data, foto_url }
}

export async function listarPersonalizadas() {
  if (MODO_DEMO) return leerDemo().personalizadas || []
  const { data, error } = await sb.from('personalizadas').select('*').order('created_at', { ascending: false })
  falla(error)
  return data
}

export async function cambiarEstadoPersonalizada(id, nuevoEstado) {
  if (MODO_DEMO) {
    const estado = leerDemo()
    estado.personalizadas = (estado.personalizadas || []).map((s) => (s.id === id ? { ...s, estado: nuevoEstado } : s))
    escribirDemo(estado)
    return
  }
  falla((await sb.from('personalizadas').update({ estado: nuevoEstado }).eq('id', id)).error)
}

export async function eliminarPersonalizada(solicitud) {
  if (MODO_DEMO) {
    const estado = leerDemo()
    estado.personalizadas = (estado.personalizadas || []).filter((s) => s.id !== solicitud.id)
    escribirDemo(estado)
    return
  }
  falla((await sb.from('personalizadas').delete().eq('id', solicitud.id)).error)
  await borrarImagenPropia(solicitud.foto_url, BUCKET_REFERENCIAS)
}

// ---------- Pedidos del catálogo y seguimiento ----------
// Registra el pedido (un producto o el carrito) y devuelve su folio PED-0001.
export async function crearPedido(tipo, items) {
  const lista = items.map((i) => ({ codigo: i.codigo, cantidad: i.cantidad || 1 }))
  if (MODO_DEMO) {
    const estado = leerDemo()
    const detalle = lista.map((i) => {
      const p = estado.productos.find((x) => x.codigo === i.codigo)
      if (!p || p.estado === 'oculto') throw new Error(`Producto no disponible: ${i.codigo}`)
      return { codigo: p.codigo, nombre: p.nombre, precio: Number(p.precio), cantidad: i.cantidad }
    })
    estado.pedidos ??= []
    estado.consecutivos.PED = (estado.consecutivos.PED || 0) + 1
    const folio = `PED-${String(estado.consecutivos.PED).padStart(4, '0')}`
    const total = detalle.reduce((s, i) => s + i.precio * i.cantidad, 0)
    estado.pedidos.unshift({ id: nuevoId(), folio, tipo, items: detalle, total, estado: 'nuevo', created_at: new Date().toISOString() })
    escribirDemo(estado)
    return folio
  }
  const { data, error } = await sb.rpc('crear_pedido', { p_tipo: tipo, p_items: lista })
  falla(error)
  return data
}

export async function listarPedidos() {
  if (MODO_DEMO) return leerDemo().pedidos || []
  const { data, error } = await sb.from('pedidos').select('*').order('created_at', { ascending: false })
  falla(error)
  return data
}

export async function cambiarEstadoPedido(id, nuevoEstado) {
  if (MODO_DEMO) {
    const estado = leerDemo()
    estado.pedidos = (estado.pedidos || []).map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p))
    escribirDemo(estado)
    return
  }
  falla((await sb.from('pedidos').update({ estado: nuevoEstado }).eq('id', id)).error)
}

export async function eliminarPedido(id) {
  if (MODO_DEMO) {
    const estado = leerDemo()
    estado.pedidos = (estado.pedidos || []).filter((p) => p.id !== id)
    escribirDemo(estado)
    return
  }
  falla((await sb.from('pedidos').delete().eq('id', id)).error)
}

// Para la página "Consultar mi pedido". Devuelve null si el folio no existe.
export async function consultarPedido(folio) {
  const f = folio.trim().toUpperCase()
  if (MODO_DEMO) {
    const estado = leerDemo()
    const p = (estado.pedidos || []).find((x) => x.folio === f)
    if (p) return { folio: p.folio, tipo: p.tipo, estado: p.estado, fecha: p.created_at, items: p.items, total: p.total }
    const s = (estado.personalizadas || []).find((x) => x.folio === f)
    return s ? { folio: s.folio, tipo: 'personalizada', estado: s.estado, fecha: s.created_at, tamano: s.tamano, fecha_evento: s.fecha_evento } : null
  }
  const { data, error } = await sb.rpc('consultar_pedido', { p_folio: f })
  falla(error)
  return data
}

// ---------- Imágenes ----------
// Las fotos de producto se guardan cuadradas (1080 × 1080) sin recortar; las de sección conservan su forma.
export async function subirImagen(archivo, opciones) {
  const blob = await redimensionarImagen(archivo, opciones)
  if (MODO_DEMO) return blobADataUrl(blob)
  const ruta = `${new Date().getFullYear()}/${nuevoId()}.jpg`
  const { error } = await sb.storage.from(BUCKET).upload(ruta, blob, { contentType: 'image/jpeg' })
  falla(error)
  return sb.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl
}

async function borrarImagenPropia(url, bucket = BUCKET) {
  const marca = `/storage/v1/object/public/${bucket}/`
  if (!url || !url.includes(marca)) return
  await sb.storage.from(bucket).remove([url.split(marca)[1]])
}

// ---------- Sesión del administrador ----------
export async function iniciarSesion(correo, contrasena) {
  if (MODO_DEMO) {
    try { sessionStorage.setItem(CLAVE_SESION_DEMO, '1') } catch { /* nada */ }
    return
  }
  const { error } = await sb.auth.signInWithPassword({ email: correo.trim(), password: contrasena })
  falla(error)
}

export async function cerrarSesion() {
  if (MODO_DEMO) {
    try { sessionStorage.removeItem(CLAVE_SESION_DEMO) } catch { /* nada */ }
    return
  }
  await sb.auth.signOut()
}

// Devuelve { correo, esAdmin } o null si no hay sesión.
export async function obtenerUsuario() {
  if (MODO_DEMO) {
    let activa = false
    try { activa = sessionStorage.getItem(CLAVE_SESION_DEMO) === '1' } catch { /* nada */ }
    return activa ? { correo: 'admin de demostración', esAdmin: true } : null
  }
  const { data } = await sb.auth.getSession()
  const usuario = data.session?.user
  if (!usuario) return null
  const { data: fila } = await sb.from('admins').select('user_id').eq('user_id', usuario.id).maybeSingle()
  return { correo: usuario.email, esAdmin: !!fila }
}

export function escucharSesion(callback) {
  if (MODO_DEMO) return () => {}
  // setTimeout: Supabase recomienda no llamar a la API dentro del propio evento.
  const { data } = sb.auth.onAuthStateChange(() => setTimeout(callback, 0))
  return () => data.subscription.unsubscribe()
}
