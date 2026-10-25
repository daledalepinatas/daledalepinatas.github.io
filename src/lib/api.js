// Capa de datos. Si hay credenciales de Supabase en el .env usa la base de datos real;
// si no, funciona en "modo demostración" guardando todo en el navegador (localStorage).
import { createClient } from '@supabase/supabase-js'
import { SECCIONES } from './config'
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
  if (/violates foreign key/i.test(msg)) return 'No se puede eliminar: todavía hay productos en esta categoría.'
  if (/duplicate key/i.test(msg)) return 'Ya existe un registro con ese nombre.'
  if (/Failed to fetch|NetworkError/i.test(msg)) return 'Sin conexión. Revisa tu internet e inténtalo de nuevo.'
  return msg
}

// ---------- Modo demostración (localStorage) ----------
const CLAVE_DEMO = 'daledale-demo-v1'
const CLAVE_SESION_DEMO = 'daledale-demo-sesion'

function leerDemo() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_DEMO))
    if (guardado?.categorias) return guardado
  } catch { /* sin almacenamiento disponible */ }
  return {
    categorias: structuredClone(demo.CATEGORIAS),
    productos: structuredClone(demo.PRODUCTOS),
    ajustes: { ...demo.AJUSTES },
    consecutivos: { PIN: 15, DUL: 6 },
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
    const { categorias, productos } = leerDemo()
    return { categorias, productos }
  }
  const [cats, prods] = await Promise.all([
    sb.from('categorias').select('*').order('orden'),
    sb.from('productos').select('*').order('codigo'),
  ])
  falla(cats.error)
  falla(prods.error)
  return { categorias: cats.data, productos: prods.data }
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
      const prefijo = SECCIONES[cat?.seccion]?.prefijo || 'PIN'
      estado.consecutivos[prefijo] = (estado.consecutivos[prefijo] || 0) + 1
      const codigo = `${prefijo}-${String(estado.consecutivos[prefijo]).padStart(4, '0')}`
      estado.productos.push({ id: nuevoId(), codigo, ...campos })
    }
    escribirDemo(estado)
    return
  }
  // El código (PIN-0001 / DUL-0001) lo asigna la base de datos y no cambia nunca.
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
  return data || { whatsapp: '', horario: '', ubicacion: '', aviso: '' }
}

export async function guardarAjustes(ajustes) {
  const campos = {
    whatsapp: ajustes.whatsapp?.trim() || '',
    horario: ajustes.horario?.trim() || '',
    ubicacion: ajustes.ubicacion?.trim() || '',
    aviso: ajustes.aviso?.trim() || '',
  }
  if (MODO_DEMO) {
    const estado = leerDemo()
    estado.ajustes = campos
    escribirDemo(estado)
    return
  }
  falla((await sb.from('ajustes').upsert({ id: 1, ...campos })).error)
}

// ---------- Imágenes ----------
export async function subirImagen(archivo) {
  const blob = await redimensionarImagen(archivo)
  if (MODO_DEMO) return blobADataUrl(blob)
  const ruta = `${new Date().getFullYear()}/${nuevoId()}.jpg`
  const { error } = await sb.storage.from(BUCKET).upload(ruta, blob, { contentType: 'image/jpeg' })
  falla(error)
  return sb.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl
}

async function borrarImagenPropia(url) {
  const marca = `/storage/v1/object/public/${BUCKET}/`
  if (!url || !url.includes(marca)) return
  await sb.storage.from(BUCKET).remove([url.split(marca)[1]])
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
