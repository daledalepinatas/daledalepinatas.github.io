import { NEGOCIO } from './config'
import { precio } from './formato'

// Acepta "661 114 9498", "+52 661..." etc. Un número de 10 dígitos se toma como de México.
export function normalizarNumero(numero) {
  const digitos = (numero || '').replace(/\D/g, '')
  return digitos.length === 10 ? `52${digitos}` : digitos
}

export function enlaceProducto(codigo) {
  return `${window.location.origin}${import.meta.env.BASE_URL}#/p/${encodeURIComponent(codigo)}`
}

export function mensajeProducto(p) {
  return [
    `¡Hola, ${NEGOCIO.nombreCorto}! Me interesa este producto:`,
    '',
    `🪅 ${p.nombre}`,
    `🔖 Código: ${p.codigo}`,
    `💲 Precio: ${precio(p.precio)}`,
    `🔗 ${enlaceProducto(p.codigo)}`,
    '',
    '¿Está disponible?',
  ].join('\n')
}

export function mensajePedido(items) {
  const lineas = items.map(
    (i) => `• ${i.cantidad} x ${i.nombre} [${i.codigo}] — ${precio(i.precio * i.cantidad)}`,
  )
  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0)
  return [
    `¡Hola, ${NEGOCIO.nombreCorto}! Quiero hacer este pedido:`,
    '',
    ...lineas,
    '',
    `Total estimado: ${precio(total)}`,
    '',
    '¿Me confirman disponibilidad y entrega?',
  ].join('\n')
}

export function urlWhatsApp(numero, mensaje) {
  return `https://wa.me/${normalizarNumero(numero)}?text=${encodeURIComponent(mensaje)}`
}

export function mensajePersonalizada(s, tamanos) {
  const lineas = [
    `¡Hola, ${NEGOCIO.nombreCorto}! Quiero una piñata personalizada:`,
    '',
    `🔖 Folio: ${s.folio}`,
    `🎨 Diseño: ${s.diseno}`,
    `📏 Tamaño: ${tamanos[s.tamano]}`,
  ]
  if (s.fecha_evento) {
    const fecha = new Date(`${s.fecha_evento}T12:00:00`)
    lineas.push(`📅 La necesito para: ${fecha.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}`)
  }
  if (s.detalles) lineas.push(`✨ Detalles: ${s.detalles}`)
  if (s.con_foto) lineas.push('📷 En seguida te envío la foto de referencia por este chat.')
  lineas.push('', '¿Me pueden cotizar?')
  return lineas.join('\n')
}
