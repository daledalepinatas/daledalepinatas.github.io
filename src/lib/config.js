// Datos de marca. Cambia aquí el nombre del negocio si lo deseas.
export const NEGOCIO = {
  nombre: '¡Dale Dale!',
  nombreCorto: 'Dale Dale',
  frase: '¡Dale, dale, dale!',
  fraseSecundaria: 'no pierdas el tino',
  subtitulo: 'Piñatería & Dulcería',
  lema: 'Piñatas hechas a mano y dulces para rellenarlas. Elige, pide por WhatsApp y ¡a romperla!',
}

// Direcciones fijas de la tienda: ninguna sección puede usarlas como id.
export const RUTAS_RESERVADAS = ['p', 'pedido', 'personalizada', 'admin']

// Personalizada vive dentro de esta sección (la de piñatas).
export const SECCION_PERSONALIZADA = 'pinatas'

export const ESTADOS = {
  disponible: 'Disponible',
  agotado: 'Agotado',
  oculto: 'Oculto (no se muestra)',
}

// Piñata personalizada: formulario fijo, primero en la sección de piñatas.
export const PERSONALIZADA = { nombre: 'Personalizada', emoji: '✨', ruta: '/personalizada' }

export const TAMANOS = {
  chica: 'Chica (50 cm)',
  normal: 'Normal (90 cm)',
  grande: 'Grande (90 cm en adelante)',
}

// Pasos de un pedido (catálogo y personalizadas). "cotizado" solo aplica a personalizadas.
export const ESTADOS_PEDIDO = {
  nuevo: { nombre: 'Nuevo', emoji: '🆕', cliente: 'Recibimos tu pedido. Te confirmaremos por WhatsApp.' },
  cotizado: { nombre: 'Cotizado', emoji: '💬', cliente: 'Te enviamos la cotización por WhatsApp.', soloPersonalizada: true },
  confirmado: { nombre: 'Confirmado', emoji: '✅', cliente: '¡Pedido confirmado! Gracias por tu compra.' },
  preparacion: { nombre: 'En preparación', emoji: '🛠️', cliente: 'Estamos preparando tu pedido con mucho cariño.' },
  listo: { nombre: 'Listo para entregar', emoji: '📦', cliente: '¡Tu pedido está listo!' },
  entregado: { nombre: 'Entregado', emoji: '🎉', cliente: 'Pedido entregado. ¡Que disfrutes tu fiesta!' },
  cancelado: { nombre: 'Cancelado', emoji: '❌', cliente: 'Este pedido fue cancelado.' },
}
