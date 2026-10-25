// Datos de PRUEBA genéricos. Las fotos son de Pexels (licencia libre, sin atribución obligatoria):
// https://www.pexels.com/license/ — reemplázalas por fotos reales de tus productos.
// Este archivo también genera supabase/seed.sql (npm run seed:sql).

const px = (ruta) => `https://images.pexels.com/photos/${ruta}?auto=compress&cs=tinysrgb&w=800`

export const IMAGENES = {
  muroPinatas: px('29837343/pexels-photo-29837343/free-photo-of-colorful-mexican-art-wall-with-pinatas.jpeg'),
  pinataColores: px('29726848/pexels-photo-29726848/free-photo-of-colorful-pinata-and-christmas-ornaments.jpeg'),
  pinataJardin: px('10037055/pexels-photo-10037055.jpeg'),
  unicornio: px('6191535/pexels-photo-6191535.jpeg'),
  unicornioCerca: px('6191534/pexels-photo-6191534.jpeg'),
  heroeCapa: px('13417377/pexels-photo-13417377.jpeg'),
  globos50: px('8014887/pexels-photo-8014887.jpeg'),
  velas21: px('8014936/pexels-photo-8014936.jpeg'),
  calabaza: px('5477538/pexels-photo-5477538.jpeg'),
  boo: px('5420833/pexels-photo-5420833.jpeg'),
  calaca: px('39246940/pexels-photo-39246940/free-photo-of-day-of-the-dead-skeleton-decoration-in-guanajuato.jpeg'),
  babyShower: px('1682462/pexels-photo-1682462.jpeg'),
  babyGlobos: px('33542457/pexels-photo-33542457/free-photo-of-outdoor-baby-shower-setup-with-balloons-and-toys.jpeg'),
  boda: px('32073438/pexels-photo-32073438/free-photo-of-elegant-outdoor-wedding-reception-celebration.jpeg'),
  gomitas: px('1193742/pexels-photo-1193742.jpeg'),
  paletas: px('5469215/pexels-photo-5469215.jpeg'),
  chocolates: px('65547/pexels-photo-65547.jpeg'),
  enchilados: px('8480925/pexels-photo-8480925.jpeg'),
  bombones: px('5890119/pexels-photo-5890119.jpeg'),
  surtido: px('5469039/pexels-photo-5469039.jpeg'),
}

export const CATEGORIAS = [
  { id: 'c01', seccion: 'pinatas', slug: 'letras-y-numeros', nombre: 'Letras y números', emoji: '🔢', orden: 1, activa: true },
  { id: 'c02', seccion: 'pinatas', slug: 'superheroes', nombre: 'Superhéroes', emoji: '🦸', orden: 2, activa: true },
  { id: 'c03', seccion: 'pinatas', slug: 'princesas', nombre: 'Princesas', emoji: '👑', orden: 3, activa: true },
  { id: 'c04', seccion: 'pinatas', slug: 'de-picos-y-sol', nombre: 'De picos y sol (tradicionales)', emoji: '⭐', orden: 4, activa: true },
  { id: 'c05', seccion: 'pinatas', slug: 'halloween-y-dia-de-muertos', nombre: 'Halloween y Día de Muertos', emoji: '💀', orden: 5, activa: true },
  { id: 'c06', seccion: 'pinatas', slug: 'baby-shower', nombre: 'Baby shower', emoji: '🍼', orden: 6, activa: true },
  { id: 'c07', seccion: 'pinatas', slug: 'bodas', nombre: 'Bodas', emoji: '💍', orden: 7, activa: true },
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
  p('PIN-0001', 'c04', 'Piñata Estrella 7 picos', 350, '80 cm de punta a punta', 'La clásica piñata de 7 picos con papel china de colores y flecos. Ideal para posadas y cumpleaños.', IMAGENES.pinataColores, { destacado: true }),
  p('PIN-0002', 'c04', 'Piñata Sol Radiante', 420, '70 cm de diámetro', 'Piñata tradicional en forma de sol con rayos de colores y cara sonriente.', IMAGENES.muroPinatas, { destacado: true }),
  p('PIN-0003', 'c04', 'Piñata Estrella Mini 5 picos', 180, '45 cm', 'Versión pequeña de la estrella tradicional, perfecta para fiestas infantiles.', IMAGENES.pinataJardin),
  p('PIN-0004', 'c01', 'Piñata Número a elegir', 380, '60 cm de alto', 'Número del 0 al 9 forrado en papel china del color que elijas. Indica el número al pedir.', IMAGENES.globos50, { destacado: true }),
  p('PIN-0005', 'c01', 'Piñata Letra inicial', 380, '60 cm de alto', 'La inicial del festejado en el color de tu fiesta.', IMAGENES.velas21),
  p('PIN-0006', 'c02', 'Piñata Héroe con capa', 450, '90 cm de alto', 'Figura de superhéroe genérico con capa de tela. Colores a elegir.', IMAGENES.heroeCapa),
  p('PIN-0007', 'c02', 'Piñata Escudo de héroe', 320, '60 cm', 'Escudo redondo con estrella al centro. Ligera y fácil de colgar.', IMAGENES.heroeCapa, { estado: 'agotado' }),
  p('PIN-0008', 'c03', 'Piñata Unicornio Mágico', 430, '75 cm de alto', 'Unicornio con cuerno dorado y melena de colores pastel.', IMAGENES.unicornio, { destacado: true }),
  p('PIN-0009', 'c03', 'Piñata Corona de princesa', 300, '50 cm', 'Corona brillante con detalles dorados y “joyas” de papel metálico.', IMAGENES.unicornioCerca),
  p('PIN-0010', 'c05', 'Piñata Calabaza', 280, '50 cm', 'Calabaza naranja con carita para tu fiesta de Halloween.', IMAGENES.calabaza),
  p('PIN-0011', 'c05', 'Piñata Fantasmita BOO', 260, '55 cm', 'Fantasma blanco con flecos plateados.', IMAGENES.boo),
  p('PIN-0012', 'c05', 'Piñata Calaverita catrina', 390, '60 cm', 'Calavera decorada con flores de papel para Día de Muertos.', IMAGENES.calaca, { destacado: true }),
  p('PIN-0013', 'c06', 'Piñata Biberón', 340, '65 cm', 'Biberón en tonos pastel. Elige rosa, azul o neutro.', IMAGENES.babyShower),
  p('PIN-0014', 'c06', 'Piñata Osito bebé', 360, '60 cm', 'Osito tierno con moño, perfecto para revelación de género.', IMAGENES.babyGlobos),
  p('PIN-0015', 'c07', 'Piñata Corazón para boda', 400, '60 cm', 'Corazón blanco con flecos dorados. Se puede personalizar con iniciales.', IMAGENES.boda),
  p('DUL-0001', 'c08', 'Gomitas surtidas', 95, 'Bolsa de 1 kg', 'Ositos y figuras de gomita de sabores surtidos.', IMAGENES.gomitas, { destacado: true }),
  p('DUL-0002', 'c09', 'Paletas de caramelo surtidas', 85, 'Bolsa de 50 piezas', 'Paletas de caramelo macizo de sabores frutales.', IMAGENES.paletas),
  p('DUL-0003', 'c10', 'Chocolates confitados', 120, 'Bolsa de 1 kg', 'Chocolates cubiertos de colores, a granel.', IMAGENES.chocolates),
  p('DUL-0004', 'c11', 'Mix enchilado', 110, 'Bolsa de 1 kg', 'Mezcla de dulces de tamarindo y enchilados.', IMAGENES.enchilados),
  p('DUL-0005', 'c12', 'Bombones de colores', 70, 'Bolsa de 500 g', 'Bombones suaves trenzados de colores.', IMAGENES.bombones),
  p('DUL-0006', 'c13', 'Bolsita de relleno básica', 25, '1 bolsita (≈ 20 dulces)', 'Mezcla lista para rellenar piñatas o repartir como bolo.', IMAGENES.surtido, { destacado: true }),
]

export const AJUSTES = {
  whatsapp: '',
  horario: 'Lunes a sábado de 10:00 a 19:00',
  ubicacion: 'Entregas a domicilio en tu ciudad',
  aviso: 'Piñatas personalizadas con 3 días de anticipación.',
}
