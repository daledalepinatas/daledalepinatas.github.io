// Datos de marca. Cambia aquí el nombre del negocio si lo deseas.
export const NEGOCIO = {
  nombre: '¡Dale Dale!',
  nombreCorto: 'Dale Dale',
  subtitulo: 'Piñatería & Dulcería',
  lema: 'Piñatas hechas a mano y dulces para rellenarlas. Elige, pide por WhatsApp y ¡a romperla!',
}

export const SECCIONES = {
  pinatas: { id: 'pinatas', nombre: 'Piñatas', emoji: '🪅', prefijo: 'PIN', ruta: '/pinatas' },
  dulceria: { id: 'dulceria', nombre: 'Dulcería', emoji: '🍬', prefijo: 'DUL', ruta: '/dulceria' },
}

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
