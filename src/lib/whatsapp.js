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

// En WhatsApp, *texto* se ve en negritas.
const LINEA = '━━━━━━━━━━━━━━'
const saludo = (emoji) => `🎉 *¡Hola, ${NEGOCIO.nombreCorto}!* ${emoji}`
const despedida = (pregunta) => [LINEA, `${pregunta} ¡Muchas gracias! 😊`]

export function mensajeProducto(p, folio) {
  const emojiSeccion = p.categoria?.seccionInfo?.emoji || '🪅'
  return [
    saludo(emojiSeccion),
    'Me interesa este producto:',
    '',
    folio ? `🧾 *Folio del pedido:* ${folio}` : null,
    `${emojiSeccion} *${p.nombre}*`,
    LINEA,
    `🔖 *Código:* ${p.codigo}`,
    `💰 *Precio:* ${precio(p.precio)}`,
    p.medida ? `📏 *Tamaño:* ${p.medida}` : null,
    p.categoria?.nombre ? `🏷️ *Categoría:* ${p.categoria.nombre}` : null,
    `🔗 *Ver producto:* ${enlaceProducto(p.codigo)}`,
    ...despedida(p.estado === 'agotado' ? '❓ ¿Cuándo vuelve a estar disponible?' : '✅ ¿Está disponible?'),
  ]
    .filter((linea) => linea !== null)
    .join('\n')
}

export function mensajePedido(items, folio) {
  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0)
  const piezas = items.reduce((s, i) => s + i.cantidad, 0)
  return [
    saludo('🛍️'),
    'Quiero hacer este pedido:',
    '',
    `🧾 *Folio del pedido:* ${folio}`,
    LINEA,
    ...items.map((i) => `🔹 *${i.cantidad} × ${i.nombre}*\n      🔖 ${i.codigo} · 💰 ${precio(i.precio * i.cantidad)}`),
    LINEA,
    `📦 *Piezas:* ${piezas}`,
    `💰 *Total estimado:* ${precio(total)}`,
    ...despedida('🚚 ¿Me confirman disponibilidad, entrega y forma de pago?'),
  ].join('\n')
}

export function mensajePersonalizada(s, tamanos) {
  const lineas = [
    saludo('🪅'),
    'Quiero una *piñata personalizada* ✨',
    '',
    `🔖 *Folio:* ${s.folio}`,
    LINEA,
    `🎨 *Diseño:* ${s.diseno}`,
    `📏 *Tamaño:* ${tamanos[s.tamano]}`,
  ]
  if (s.fecha_evento) {
    const fecha = new Date(`${s.fecha_evento}T12:00:00`)
    lineas.push(`📅 *La necesito para:* ${fecha.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`)
  }
  if (s.detalles) lineas.push(`📝 *Detalles:* ${s.detalles}`)
  if (s.foto_url) lineas.push(`📷 *Foto de referencia:* ${s.foto_url}`)
  lineas.push(...despedida('💬 ¿Me pueden cotizar?'))
  return lineas.join('\n')
}

// Abre la pestaña de WhatsApp durante el clic (si no, el navegador la bloquea) y la dirige al
// mensaje cuando ya se registró el pedido. Si no se pudo abrir, usa la misma pestaña.
export async function abrirWhatsApp(obtenerUrl) {
  const ventana = window.open('', '_blank')
  try {
    const url = await obtenerUrl()
    if (ventana) ventana.location.href = url
    else window.location.href = url
    return url
  } catch (error) {
    ventana?.close()
    throw error
  }
}

// api.whatsapp.com en lugar de wa.me: wa.me a veces convierte los emojis en "�".
export function urlWhatsApp(numero, mensaje) {
  return `https://api.whatsapp.com/send?phone=${normalizarNumero(numero)}&text=${encodeURIComponent(mensaje)}`
}
