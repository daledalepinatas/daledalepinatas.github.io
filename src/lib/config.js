// Datos de marca. Cambia aquí el nombre del negocio si lo deseas.
export const NEGOCIO = {
  nombre: '¡Dale Dale!',
  nombreCorto: 'Dale Dale',
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

export const ESTADOS_PERSONALIZADA = {
  nueva: 'Nueva',
  cotizada: 'Cotizada',
  aceptada: 'Aceptada',
  entregada: 'Entregada',
  cancelada: 'Cancelada',
}
