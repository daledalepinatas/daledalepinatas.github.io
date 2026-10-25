-- =====================================================================
--  DATOS DE PRUEBA genéricos (generado con: npm run seed:sql — no editar a mano)
--  Ejecútalo en Supabase > SQL Editor DESPUÉS de schema.sql. Opcional.
--  Fotos de Unsplash (licencia gratuita): https://unsplash.com/license
-- =====================================================================

insert into public.categorias (seccion, nombre, slug, emoji, orden, activa) values
  ('pinatas', 'Letras', 'letras', '🔤', 2, true),
  ('pinatas', 'Números', 'numeros', '🔢', 3, true),
  ('pinatas', 'De picos', 'de-picos', '⭐', 4, true),
  ('pinatas', 'Superhéroes', 'superheroes', '🦸', 5, false),
  ('pinatas', 'Princesas', 'princesas', '👑', 6, false),
  ('pinatas', 'Halloween y Día de Muertos', 'halloween-y-dia-de-muertos', '💀', 7, false),
  ('pinatas', 'Baby shower', 'baby-shower', '🍼', 8, false),
  ('pinatas', 'Bodas', 'bodas', '💍', 9, false),
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
  ('PIN-0001', 'de-picos', 'Piñata Estrella 7 picos', 350, '80 cm de punta a punta', 'La clásica piñata de 7 picos con papel china de colores y flecos. Ideal para posadas y cumpleaños.', 'https://images.unsplash.com/photo-1778472468507-335011815f7f?auto=format&fit=crop&w=800&q=80', 'disponible', true),
  ('PIN-0002', 'de-picos', 'Piñata Sol Radiante', 420, '70 cm de diámetro', 'Piñata tradicional en forma de sol con rayos de colores y cara sonriente.', 'https://images.unsplash.com/photo-1609829643742-19485cc841ba?auto=format&fit=crop&w=800&q=80', 'disponible', true),
  ('PIN-0003', 'de-picos', 'Piñata Estrella Mini 5 picos', 180, '45 cm', 'Versión pequeña de la estrella tradicional, perfecta para fiestas infantiles.', 'https://images.unsplash.com/photo-1528185796833-c5827a298584?auto=format&fit=crop&w=800&q=80', 'disponible', false),
  ('PIN-0004', 'numeros', 'Piñata Número a elegir', 380, '60 cm de alto', 'Número del 0 al 9 forrado en papel china del color que elijas. Indica el número al pedir.', 'https://images.unsplash.com/photo-1791600158462-ab9a93c248d4?auto=format&fit=crop&w=800&q=80', 'disponible', true),
  ('PIN-0005', 'letras', 'Piñata Letra inicial', 380, '60 cm de alto', 'La inicial del festejado en el color de tu fiesta.', 'https://images.unsplash.com/photo-1772758767181-c5a93b8a52b2?auto=format&fit=crop&w=800&q=80', 'disponible', false),
  ('PIN-0006', 'superheroes', 'Piñata Héroe con capa', 450, '90 cm de alto', 'Figura de superhéroe genérico con capa de tela. Colores a elegir.', 'https://images.unsplash.com/photo-1542000551557-3fd0ad0eb15f?auto=format&fit=crop&w=800&q=80', 'disponible', false),
  ('PIN-0007', 'superheroes', 'Piñata Escudo de héroe', 320, '60 cm', 'Escudo redondo con estrella al centro. Ligera y fácil de colgar.', 'https://images.unsplash.com/photo-1542000551557-3fd0ad0eb15f?auto=format&fit=crop&w=800&q=80', 'agotado', false),
  ('PIN-0008', 'princesas', 'Piñata Unicornio Mágico', 430, '75 cm de alto', 'Unicornio con cuerno dorado y melena de colores pastel.', 'https://images.unsplash.com/photo-1607653150149-526b2744ca60?auto=format&fit=crop&w=800&q=80', 'disponible', true),
  ('PIN-0009', 'princesas', 'Piñata Corona de princesa', 300, '50 cm', 'Corona brillante con detalles dorados y “joyas” de papel metálico.', 'https://images.unsplash.com/photo-1673640525972-3c0dd5e6a933?auto=format&fit=crop&w=800&q=80', 'disponible', false),
  ('PIN-0010', 'halloween-y-dia-de-muertos', 'Piñata Calabaza', 280, '50 cm', 'Calabaza naranja con carita para tu fiesta de Halloween.', 'https://images.unsplash.com/photo-1508361001413-7a9dca21d08a?auto=format&fit=crop&w=800&q=80', 'disponible', false),
  ('PIN-0011', 'halloween-y-dia-de-muertos', 'Piñata Fantasmita BOO', 260, '55 cm', 'Fantasma blanco con flecos plateados.', 'https://images.unsplash.com/photo-1635442061163-be4e9f34be3b?auto=format&fit=crop&w=800&q=80', 'disponible', false),
  ('PIN-0012', 'halloween-y-dia-de-muertos', 'Piñata Calaverita catrina', 390, '60 cm', 'Calavera decorada con flores de papel para Día de Muertos.', 'https://images.unsplash.com/photo-1601325979086-d54da2c7419c?auto=format&fit=crop&w=800&q=80', 'disponible', true),
  ('PIN-0013', 'baby-shower', 'Piñata Biberón', 340, '65 cm', 'Biberón en tonos pastel. Elige rosa, azul o neutro.', 'https://images.unsplash.com/photo-1543346242-2b8e41fb91ca?auto=format&fit=crop&w=800&q=80', 'disponible', false),
  ('PIN-0014', 'baby-shower', 'Piñata Osito bebé', 360, '60 cm', 'Osito tierno con moño, perfecto para revelación de género.', 'https://images.unsplash.com/photo-1562077477-eb2409f73c49?auto=format&fit=crop&w=800&q=80', 'disponible', false),
  ('PIN-0015', 'bodas', 'Piñata Corazón para boda', 400, '60 cm', 'Corazón blanco con flecos dorados. Se puede personalizar con iniciales.', 'https://images.unsplash.com/photo-1757589227072-0dd17af42433?auto=format&fit=crop&w=800&q=80', 'disponible', false),
  ('DUL-0001', 'gomitas', 'Gomitas surtidas', 95, 'Bolsa de 1 kg', 'Ositos y figuras de gomita de sabores surtidos.', 'https://images.unsplash.com/photo-1635342219731-4ae2bf39e1e9?auto=format&fit=crop&w=800&q=80', 'disponible', true),
  ('DUL-0002', 'paletas', 'Paletas de caramelo surtidas', 85, 'Bolsa de 50 piezas', 'Paletas de caramelo macizo de sabores frutales.', 'https://images.unsplash.com/photo-1598188080888-42dfffa02287?auto=format&fit=crop&w=800&q=80', 'disponible', false),
  ('DUL-0003', 'chocolates', 'Chocolates confitados', 120, 'Bolsa de 1 kg', 'Chocolates cubiertos de colores, a granel.', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80', 'disponible', false),
  ('DUL-0004', 'enchilados-y-tamarindo', 'Mix enchilado', 110, 'Bolsa de 1 kg', 'Mezcla de dulces de tamarindo y enchilados.', 'https://images.unsplash.com/photo-1578075173269-4c0d554acabd?auto=format&fit=crop&w=800&q=80', 'disponible', false),
  ('DUL-0005', 'bombones', 'Bombones de colores', 70, 'Bolsa de 500 g', 'Bombones suaves trenzados de colores.', 'https://images.unsplash.com/photo-1518646455738-c17d10184f5e?auto=format&fit=crop&w=800&q=80', 'disponible', false),
  ('DUL-0006', 'bolsitas-para-relleno', 'Bolsita de relleno básica', 25, '1 bolsita (≈ 20 dulces)', 'Mezcla lista para rellenar piñatas o repartir como bolo.', 'https://images.unsplash.com/photo-1765317269952-82ca1acdd2ca?auto=format&fit=crop&w=800&q=80', 'disponible', true)
) as v(codigo, slug, nombre, precio, medida, descripcion, imagen_url, estado, destacado)
join public.categorias c on c.slug = v.slug
on conflict (codigo) do nothing;

-- Continúa la numeración después de los productos de prueba.
select setval('public.consecutivo_pin', greatest(15, (select coalesce(max(substring(codigo from 5)::int), 0) from public.productos where codigo like 'PIN-%')));
select setval('public.consecutivo_dul', greatest(6, (select coalesce(max(substring(codigo from 5)::int), 0) from public.productos where codigo like 'DUL-%')));

-- Ajustes de ejemplo (el número de WhatsApp se configura desde el panel de administración).
update public.ajustes set horario = 'Lunes a sábado de 10:00 a 19:00', ubicacion = 'Entregas a domicilio en tu ciudad', aviso = 'Piñatas personalizadas con 3 días de anticipación.'
where id = 1 and horario = '';
