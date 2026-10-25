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
