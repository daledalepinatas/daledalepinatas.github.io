-- =====================================================================
--  DATOS DE PRUEBA genéricos (generado con: npm run seed:sql — no editar a mano)
--  Ejecútalo en Supabase > SQL Editor DESPUÉS de schema.sql. Opcional.
--  Fotos de Pexels (licencia libre): https://www.pexels.com/license/
-- =====================================================================

insert into public.categorias (seccion, nombre, slug, emoji, orden, activa) values
  ('pinatas', 'Letras y números', 'letras-y-numeros', '🔢', 1, true),
  ('pinatas', 'Superhéroes', 'superheroes', '🦸', 2, true),
  ('pinatas', 'Princesas', 'princesas', '👑', 3, true),
  ('pinatas', 'De picos y sol (tradicionales)', 'de-picos-y-sol', '⭐', 4, true),
  ('pinatas', 'Halloween y Día de Muertos', 'halloween-y-dia-de-muertos', '💀', 5, true),
  ('pinatas', 'Baby shower', 'baby-shower', '🍼', 6, true),
  ('pinatas', 'Bodas', 'bodas', '💍', 7, true),
  ('dulceria', 'Gomitas', 'gomitas', '🐻', 1, true),
  ('dulceria', 'Paletas', 'paletas', '🍭', 2, true),
  ('dulceria', 'Chocolates', 'chocolates', '🍫', 3, true),
  ('dulceria', 'Enchilados y tamarindo', 'enchilados-y-tamarindo', '🌶️', 4, true),
  ('dulceria', 'Bombones', 'bombones', '☁️', 5, true),
  ('dulceria', 'Bolsitas para relleno', 'bolsitas-para-relleno', '🎁', 6, true)
on conflict (slug) do nothing;

insert into public.productos (codigo, categoria_id, nombre, precio, medida, descripcion, imagen_url, estado, destacado)
select v.codigo, c.id, v.nombre, v.precio, v.medida, v.descripcion, v.imagen_url, v.estado, v.destacado
from (values
  ('PIN-0001', 'de-picos-y-sol', 'Piñata Estrella 7 picos', 350, '80 cm de punta a punta', 'La clásica piñata de 7 picos con papel china de colores y flecos. Ideal para posadas y cumpleaños.', 'https://images.pexels.com/photos/29726848/pexels-photo-29726848/free-photo-of-colorful-pinata-and-christmas-ornaments.jpeg?auto=compress&cs=tinysrgb&w=800', 'disponible', true),
  ('PIN-0002', 'de-picos-y-sol', 'Piñata Sol Radiante', 420, '70 cm de diámetro', 'Piñata tradicional en forma de sol con rayos de colores y cara sonriente.', 'https://images.pexels.com/photos/29837343/pexels-photo-29837343/free-photo-of-colorful-mexican-art-wall-with-pinatas.jpeg?auto=compress&cs=tinysrgb&w=800', 'disponible', true),
  ('PIN-0003', 'de-picos-y-sol', 'Piñata Estrella Mini 5 picos', 180, '45 cm', 'Versión pequeña de la estrella tradicional, perfecta para fiestas infantiles.', 'https://images.pexels.com/photos/10037055/pexels-photo-10037055.jpeg?auto=compress&cs=tinysrgb&w=800', 'disponible', false),
  ('PIN-0004', 'letras-y-numeros', 'Piñata Número a elegir', 380, '60 cm de alto', 'Número del 0 al 9 forrado en papel china del color que elijas. Indica el número al pedir.', 'https://images.pexels.com/photos/8014887/pexels-photo-8014887.jpeg?auto=compress&cs=tinysrgb&w=800', 'disponible', true),
  ('PIN-0005', 'letras-y-numeros', 'Piñata Letra inicial', 380, '60 cm de alto', 'La inicial del festejado en el color de tu fiesta.', 'https://images.pexels.com/photos/8014936/pexels-photo-8014936.jpeg?auto=compress&cs=tinysrgb&w=800', 'disponible', false),
  ('PIN-0006', 'superheroes', 'Piñata Héroe con capa', 450, '90 cm de alto', 'Figura de superhéroe genérico con capa de tela. Colores a elegir.', 'https://images.pexels.com/photos/13417377/pexels-photo-13417377.jpeg?auto=compress&cs=tinysrgb&w=800', 'disponible', false),
  ('PIN-0007', 'superheroes', 'Piñata Escudo de héroe', 320, '60 cm', 'Escudo redondo con estrella al centro. Ligera y fácil de colgar.', 'https://images.pexels.com/photos/13417377/pexels-photo-13417377.jpeg?auto=compress&cs=tinysrgb&w=800', 'agotado', false),
  ('PIN-0008', 'princesas', 'Piñata Unicornio Mágico', 430, '75 cm de alto', 'Unicornio con cuerno dorado y melena de colores pastel.', 'https://images.pexels.com/photos/6191535/pexels-photo-6191535.jpeg?auto=compress&cs=tinysrgb&w=800', 'disponible', true),
  ('PIN-0009', 'princesas', 'Piñata Corona de princesa', 300, '50 cm', 'Corona brillante con detalles dorados y “joyas” de papel metálico.', 'https://images.pexels.com/photos/6191534/pexels-photo-6191534.jpeg?auto=compress&cs=tinysrgb&w=800', 'disponible', false),
  ('PIN-0010', 'halloween-y-dia-de-muertos', 'Piñata Calabaza', 280, '50 cm', 'Calabaza naranja con carita para tu fiesta de Halloween.', 'https://images.pexels.com/photos/5477538/pexels-photo-5477538.jpeg?auto=compress&cs=tinysrgb&w=800', 'disponible', false),
  ('PIN-0011', 'halloween-y-dia-de-muertos', 'Piñata Fantasmita BOO', 260, '55 cm', 'Fantasma blanco con flecos plateados.', 'https://images.pexels.com/photos/5420833/pexels-photo-5420833.jpeg?auto=compress&cs=tinysrgb&w=800', 'disponible', false),
  ('PIN-0012', 'halloween-y-dia-de-muertos', 'Piñata Calaverita catrina', 390, '60 cm', 'Calavera decorada con flores de papel para Día de Muertos.', 'https://images.pexels.com/photos/39246940/pexels-photo-39246940/free-photo-of-day-of-the-dead-skeleton-decoration-in-guanajuato.jpeg?auto=compress&cs=tinysrgb&w=800', 'disponible', true),
  ('PIN-0013', 'baby-shower', 'Piñata Biberón', 340, '65 cm', 'Biberón en tonos pastel. Elige rosa, azul o neutro.', 'https://images.pexels.com/photos/1682462/pexels-photo-1682462.jpeg?auto=compress&cs=tinysrgb&w=800', 'disponible', false),
  ('PIN-0014', 'baby-shower', 'Piñata Osito bebé', 360, '60 cm', 'Osito tierno con moño, perfecto para revelación de género.', 'https://images.pexels.com/photos/33542457/pexels-photo-33542457/free-photo-of-outdoor-baby-shower-setup-with-balloons-and-toys.jpeg?auto=compress&cs=tinysrgb&w=800', 'disponible', false),
  ('PIN-0015', 'bodas', 'Piñata Corazón para boda', 400, '60 cm', 'Corazón blanco con flecos dorados. Se puede personalizar con iniciales.', 'https://images.pexels.com/photos/32073438/pexels-photo-32073438/free-photo-of-elegant-outdoor-wedding-reception-celebration.jpeg?auto=compress&cs=tinysrgb&w=800', 'disponible', false),
  ('DUL-0001', 'gomitas', 'Gomitas surtidas', 95, 'Bolsa de 1 kg', 'Ositos y figuras de gomita de sabores surtidos.', 'https://images.pexels.com/photos/1193742/pexels-photo-1193742.jpeg?auto=compress&cs=tinysrgb&w=800', 'disponible', true),
  ('DUL-0002', 'paletas', 'Paletas de caramelo surtidas', 85, 'Bolsa de 50 piezas', 'Paletas de caramelo macizo de sabores frutales.', 'https://images.pexels.com/photos/5469215/pexels-photo-5469215.jpeg?auto=compress&cs=tinysrgb&w=800', 'disponible', false),
  ('DUL-0003', 'chocolates', 'Chocolates confitados', 120, 'Bolsa de 1 kg', 'Chocolates cubiertos de colores, a granel.', 'https://images.pexels.com/photos/65547/pexels-photo-65547.jpeg?auto=compress&cs=tinysrgb&w=800', 'disponible', false),
  ('DUL-0004', 'enchilados-y-tamarindo', 'Mix enchilado', 110, 'Bolsa de 1 kg', 'Mezcla de dulces de tamarindo y enchilados.', 'https://images.pexels.com/photos/8480925/pexels-photo-8480925.jpeg?auto=compress&cs=tinysrgb&w=800', 'disponible', false),
  ('DUL-0005', 'bombones', 'Bombones de colores', 70, 'Bolsa de 500 g', 'Bombones suaves trenzados de colores.', 'https://images.pexels.com/photos/5890119/pexels-photo-5890119.jpeg?auto=compress&cs=tinysrgb&w=800', 'disponible', false),
  ('DUL-0006', 'bolsitas-para-relleno', 'Bolsita de relleno básica', 25, '1 bolsita (≈ 20 dulces)', 'Mezcla lista para rellenar piñatas o repartir como bolo.', 'https://images.pexels.com/photos/5469039/pexels-photo-5469039.jpeg?auto=compress&cs=tinysrgb&w=800', 'disponible', true)
) as v(codigo, slug, nombre, precio, medida, descripcion, imagen_url, estado, destacado)
join public.categorias c on c.slug = v.slug
on conflict (codigo) do nothing;

-- Continúa la numeración después de los productos de prueba.
select setval('public.consecutivo_pin', greatest(15, (select coalesce(max(substring(codigo from 5)::int), 0) from public.productos where codigo like 'PIN-%')));
select setval('public.consecutivo_dul', greatest(6, (select coalesce(max(substring(codigo from 5)::int), 0) from public.productos where codigo like 'DUL-%')));

-- Ajustes de ejemplo (el número de WhatsApp se configura desde el panel de administración).
update public.ajustes set horario = 'Lunes a sábado de 10:00 a 19:00', ubicacion = 'Entregas a domicilio en tu ciudad', aviso = 'Piñatas personalizadas con 3 días de anticipación.'
where id = 1 and horario = '';
