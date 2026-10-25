// Datos de PRUEBA genéricos. Las fotos son de Unsplash (licencia gratuita, sin atribución obligatoria;
// se excluyen las de pago "Unsplash+"): https://unsplash.com/license — reemplázalas por fotos reales.
// Este archivo también genera supabase/seed.sql (npm run seed:sql).

const us = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`

export const IMAGENES = {
  estrella7: us('1778472468507-335011815f7f'),
  estrellaCalle: us('1609829643742-19485cc841ba'),
  burrito: us('1528185796833-c5827a298584'),
  numero50: us('1791600158462-ab9a93c248d4'),
  letras: us('1772758767181-c5a93b8a52b2'),
  heroe: us('1542000551557-3fd0ad0eb15f'),
  unicornio: us('1607653150149-526b2744ca60'),
  corona: us('1673640525972-3c0dd5e6a933'),
  calabaza: us('1508361001413-7a9dca21d08a'),
  fantasma: us('1635442061163-be4e9f34be3b'),
  calaveritas: us('1601325979086-d54da2c7419c'),
  movilBebe: us('1543346242-2b8e41fb91ca'),
  pinataPastel: us('1562077477-eb2409f73c49'),
  boda: us('1757589227072-0dd17af42433'),
  gomitas: us('1635342219731-4ae2bf39e1e9'),
  paletas: us('1598188080888-42dfffa02287'),
  chocolates: us('1599599810769-bcde5a160d32'),
  tamarindo: us('1578075173269-4c0d554acabd'),
  bombones: us('1518646455738-c17d10184f5e'),
  bolsitas: us('1765317269952-82ca1acdd2ca'),
}

// Secciones del menú. El id es la dirección (/pinatas) y el prefijo forma los códigos (PIN-0001).
export const SECCIONES = [
  { id: 'pinatas', nombre: 'Piñatas', emoji: '🪅', prefijo: 'PIN', imagen_url: IMAGENES.estrella7, orden: 1, activa: true, consecutivo: 15 },
  { id: 'dulceria', nombre: 'Dulcería', emoji: '🍬', prefijo: 'DUL', imagen_url: IMAGENES.gomitas, orden: 2, activa: true, consecutivo: 6 },
]

export const CATEGORIAS = [
  // La sección "✨ Personalizada" no es una categoría: es un formulario fijo que siempre va primero.
  { id: 'c01', seccion: 'pinatas', slug: 'letras', nombre: 'Letras', emoji: '🔤', orden: 2, activa: true },
  { id: 'c14', seccion: 'pinatas', slug: 'numeros', nombre: 'Números', emoji: '🔢', orden: 3, activa: true },
  { id: 'c04', seccion: 'pinatas', slug: 'de-picos', nombre: 'De picos', emoji: '⭐', orden: 4, activa: true },
  // Categorías ocultas ("Ya no se vende"): se pueden reactivar desde el panel.
  { id: 'c02', seccion: 'pinatas', slug: 'superheroes', nombre: 'Superhéroes', emoji: '🦸', orden: 5, activa: false },
  { id: 'c03', seccion: 'pinatas', slug: 'princesas', nombre: 'Princesas', emoji: '👑', orden: 6, activa: false },
  { id: 'c05', seccion: 'pinatas', slug: 'halloween-y-dia-de-muertos', nombre: 'Halloween y Día de Muertos', emoji: '💀', orden: 7, activa: false },
  { id: 'c06', seccion: 'pinatas', slug: 'baby-shower', nombre: 'Baby shower', emoji: '🍼', orden: 8, activa: false },
  { id: 'c07', seccion: 'pinatas', slug: 'bodas', nombre: 'Bodas', emoji: '💍', orden: 9, activa: false },
  { id: 'c08', seccion: 'dulceria', slug: 'gomitas', nombre: 'Gomitas', emoji: '🐻', orden: 1, activa: true },
  { id: 'c09', seccion: 'dulceria', slug: 'paletas', nombre: 'Paletas', emoji: '🍭', orden: 2, activa: true },
  { id: 'c10', seccion: 'dulceria', slug: 'chocolates', nombre: 'Chocolates', emoji: '🍫', orden: 3, activa: true },
  { id: 'c11', seccion: 'dulceria', slug: 'enchilados-y-tamarindo', nombre: 'Enchilados y tamarindo', emoji: '🌶️', orden: 4, activa: true },
  { id: 'c12', seccion: 'dulceria', slug: 'bombones', nombre: 'Bombones', emoji: '☁️', orden: 5, activa: true },
  { id: 'c13', seccion: 'dulceria', slug: 'bolsitas-para-relleno', nombre: 'Bolsitas para relleno', emoji: '🎁', orden: 6, activa: true },
]

const p = (codigo, categoria_id, nombre, precio, medida, descripcion, imagen_url, extra = {}) => ({
  id: `p-${codigo}`,
  codigo,
  categoria_id,
  nombre,
  precio,
  medida,
  descripcion,
  imagen_url,
  estado: 'disponible',
  destacado: false,
  ...extra,
})

export const PRODUCTOS = [
  p('PIN-0001', 'c04', 'Piñata Estrella 7 picos', 350, '80 cm de punta a punta', 'La clásica piñata de 7 picos con papel china de colores y flecos. Ideal para posadas y cumpleaños.', IMAGENES.estrella7, { destacado: true }),
  p('PIN-0002', 'c04', 'Piñata Sol Radiante', 420, '70 cm de diámetro', 'Piñata tradicional en forma de sol con rayos de colores y cara sonriente.', IMAGENES.estrellaCalle, { destacado: true }),
  p('PIN-0003', 'c04', 'Piñata Estrella Mini 5 picos', 180, '45 cm', 'Versión pequeña de la estrella tradicional, perfecta para fiestas infantiles.', IMAGENES.burrito),
  p('PIN-0004', 'c14', 'Piñata Número a elegir', 380, '60 cm de alto', 'Número del 0 al 9 forrado en papel china del color que elijas. Indica el número al pedir.', IMAGENES.numero50, { destacado: true }),
  p('PIN-0005', 'c01', 'Piñata Letra inicial', 380, '60 cm de alto', 'La inicial del festejado en el color de tu fiesta.', IMAGENES.letras),
  p('PIN-0006', 'c02', 'Piñata Héroe con capa', 450, '90 cm de alto', 'Figura de superhéroe genérico con capa de tela. Colores a elegir.', IMAGENES.heroe),
  p('PIN-0007', 'c02', 'Piñata Escudo de héroe', 320, '60 cm', 'Escudo redondo con estrella al centro. Ligera y fácil de colgar.', IMAGENES.heroe, { estado: 'agotado' }),
  p('PIN-0008', 'c03', 'Piñata Unicornio Mágico', 430, '75 cm de alto', 'Unicornio con cuerno dorado y melena de colores pastel.', IMAGENES.unicornio, { destacado: true }),
  p('PIN-0009', 'c03', 'Piñata Corona de princesa', 300, '50 cm', 'Corona brillante con detalles dorados y “joyas” de papel metálico.', IMAGENES.corona),
  p('PIN-0010', 'c05', 'Piñata Calabaza', 280, '50 cm', 'Calabaza naranja con carita para tu fiesta de Halloween.', IMAGENES.calabaza),
  p('PIN-0011', 'c05', 'Piñata Fantasmita BOO', 260, '55 cm', 'Fantasma blanco con flecos plateados.', IMAGENES.fantasma),
  p('PIN-0012', 'c05', 'Piñata Calaverita catrina', 390, '60 cm', 'Calavera decorada con flores de papel para Día de Muertos.', IMAGENES.calaveritas, { destacado: true }),
  p('PIN-0013', 'c06', 'Piñata Biberón', 340, '65 cm', 'Biberón en tonos pastel. Elige rosa, azul o neutro.', IMAGENES.movilBebe),
  p('PIN-0014', 'c06', 'Piñata Osito bebé', 360, '60 cm', 'Osito tierno con moño, perfecto para revelación de género.', IMAGENES.pinataPastel),
  p('PIN-0015', 'c07', 'Piñata Corazón para boda', 400, '60 cm', 'Corazón blanco con flecos dorados. Se puede personalizar con iniciales.', IMAGENES.boda),
  p('DUL-0001', 'c08', 'Gomitas surtidas', 95, 'Bolsa de 1 kg', 'Ositos y figuras de gomita de sabores surtidos.', IMAGENES.gomitas, { destacado: true }),
  p('DUL-0002', 'c09', 'Paletas de caramelo surtidas', 85, 'Bolsa de 50 piezas', 'Paletas de caramelo macizo de sabores frutales.', IMAGENES.paletas),
  p('DUL-0003', 'c10', 'Chocolates confitados', 120, 'Bolsa de 1 kg', 'Chocolates cubiertos de colores, a granel.', IMAGENES.chocolates),
  p('DUL-0004', 'c11', 'Mix enchilado', 110, 'Bolsa de 1 kg', 'Mezcla de dulces de tamarindo y enchilados.', IMAGENES.tamarindo),
  p('DUL-0005', 'c12', 'Bombones de colores', 70, 'Bolsa de 500 g', 'Bombones suaves trenzados de colores.', IMAGENES.bombones),
  p('DUL-0006', 'c13', 'Bolsita de relleno básica', 25, '1 bolsita (≈ 20 dulces)', 'Mezcla lista para rellenar piñatas o repartir como bolo.', IMAGENES.bolsitas, { destacado: true }),
]

export const AJUSTES = {
  whatsapp: '',
  horario: 'Lunes a sábado de 10:00 a 19:00',
  ubicacion: 'Entregas a domicilio en tu ciudad',
  aviso: 'Piñatas personalizadas con 3 días de anticipación.',
  personalizada_activa: true,
}
