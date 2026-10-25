// Genera supabase/seed.sql a partir de src/lib/datosDemo.js
// Uso: npm run seed:sql
import { writeFileSync } from 'node:fs'
import { AJUSTES, CATEGORIAS, PRODUCTOS } from '../src/lib/datosDemo.js'

const q = (v) => `'${String(v).replace(/'/g, "''")}'`
const slugDe = Object.fromEntries(CATEGORIAS.map((c) => [c.id, c.slug]))

const cats = CATEGORIAS.map(
  (c) => `  (${q(c.seccion)}, ${q(c.nombre)}, ${q(c.slug)}, ${q(c.emoji)}, ${c.orden}, ${c.activa})`,
).join(',\n')

const prods = PRODUCTOS.map(
  (p) =>
    `  (${q(p.codigo)}, ${q(slugDe[p.categoria_id])}, ${q(p.nombre)}, ${p.precio}, ${q(p.medida)}, ${q(p.descripcion)}, ${q(p.imagen_url)}, ${q(p.estado)}, ${p.destacado})`,
).join(',\n')

const maxDe = (pref) => Math.max(0, ...PRODUCTOS.filter((p) => p.codigo.startsWith(pref)).map((p) => +p.codigo.slice(4)))

const sql = `-- =====================================================================
--  DATOS DE PRUEBA genéricos (generado con: npm run seed:sql — no editar a mano)
--  Ejecútalo en Supabase > SQL Editor DESPUÉS de schema.sql. Opcional.
--  Fotos de Pexels (licencia libre): https://www.pexels.com/license/
-- =====================================================================

insert into public.categorias (seccion, nombre, slug, emoji, orden, activa) values
${cats}
on conflict (slug) do nothing;

insert into public.productos (codigo, categoria_id, nombre, precio, medida, descripcion, imagen_url, estado, destacado)
select v.codigo, c.id, v.nombre, v.precio, v.medida, v.descripcion, v.imagen_url, v.estado, v.destacado
from (values
${prods}
) as v(codigo, slug, nombre, precio, medida, descripcion, imagen_url, estado, destacado)
join public.categorias c on c.slug = v.slug
on conflict (codigo) do nothing;

-- Continúa la numeración después de los productos de prueba.
select setval('public.consecutivo_pin', greatest(${maxDe('PIN')}, (select coalesce(max(substring(codigo from 5)::int), 0) from public.productos where codigo like 'PIN-%')));
select setval('public.consecutivo_dul', greatest(${maxDe('DUL')}, (select coalesce(max(substring(codigo from 5)::int), 0) from public.productos where codigo like 'DUL-%')));

-- Ajustes de ejemplo (el número de WhatsApp se configura desde el panel de administración).
update public.ajustes set horario = ${q(AJUSTES.horario)}, ubicacion = ${q(AJUSTES.ubicacion)}, aviso = ${q(AJUSTES.aviso)}
where id = 1 and horario = '';
`

writeFileSync(new URL('../supabase/seed.sql', import.meta.url), sql)
console.log(`supabase/seed.sql generado: ${CATEGORIAS.length} categorías, ${PRODUCTOS.length} productos.`)
