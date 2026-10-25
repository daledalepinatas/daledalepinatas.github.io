-- =====================================================================
--  ¡Dale Dale! Piñatería & Dulcería — esquema de base de datos (Supabase)
--  Cómo usarlo: Supabase > SQL Editor > New query > pega TODO este archivo > Run.
--  Es seguro ejecutarlo más de una vez.
-- =====================================================================

-- ---------- Tablas ----------
-- Secciones del menú (Piñatas, Dulcería, …). El id es la dirección en la web (/dulceria) y el
-- prefijo (3 letras) forma los códigos de producto (DUL-0001). Ninguno de los dos cambia después.
create table if not exists public.secciones (
  id          text primary key check (id ~ '^[a-z0-9-]{1,40}$' and id not in ('p', 'pedido', 'personalizada', 'admin')),
  nombre      text not null check (char_length(nombre) between 1 and 40),
  emoji       text not null default '🎉',
  imagen_url  text not null default '',
  prefijo     text not null unique check (prefijo ~ '^[A-Z]{3}$' and prefijo <> 'PER'),
  consecutivo int  not null default 0,
  orden       int  not null default 0,
  activa      boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.categorias (
  id         uuid primary key default gen_random_uuid(),
  seccion    text not null,
  nombre     text not null check (char_length(nombre) between 1 and 60),
  slug       text not null unique,
  emoji      text not null default '🎉',
  orden      int  not null default 0,
  activa     boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.productos (
  id           uuid primary key default gen_random_uuid(),
  codigo       text not null unique,
  categoria_id uuid not null references public.categorias(id) on delete restrict,
  nombre       text not null check (char_length(nombre) between 1 and 120),
  precio       numeric(10, 2) not null check (precio >= 0),
  medida       text not null default '',
  descripcion  text not null default '' check (char_length(descripcion) <= 600),
  imagen_url   text not null default '',
  estado       text not null default 'disponible' check (estado in ('disponible', 'agotado', 'oculto')),
  destacado    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists productos_categoria_idx on public.productos (categoria_id);

-- Secciones de base. Su consecutivo continúa después del último código usado (nunca se repite un código).
do $$
declare
  pin int := 0;
  dul int := 0;
begin
  if to_regclass('public.consecutivo_pin') is not null then
    execute 'select case when is_called then last_value else 0 end from public.consecutivo_pin' into pin;
  end if;
  if to_regclass('public.consecutivo_dul') is not null then
    execute 'select case when is_called then last_value else 0 end from public.consecutivo_dul' into dul;
  end if;
  pin := greatest(pin, (select coalesce(max(substring(codigo from 5)::int), 0) from public.productos where codigo ~ '^PIN-\d+$'));
  dul := greatest(dul, (select coalesce(max(substring(codigo from 5)::int), 0) from public.productos where codigo ~ '^DUL-\d+$'));
  insert into public.secciones (id, nombre, emoji, prefijo, orden, consecutivo, imagen_url) values
    ('pinatas', 'Piñatas', '🪅', 'PIN', 1, pin, 'https://images.unsplash.com/photo-1778472468507-335011815f7f?auto=format&fit=crop&w=800&q=80'),
    ('dulceria', 'Dulcería', '🍬', 'DUL', 2, dul, 'https://images.unsplash.com/photo-1635342219731-4ae2bf39e1e9?auto=format&fit=crop&w=800&q=80')
  on conflict (id) do nothing;
end $$;

-- Cada categoría pertenece a una sección existente (antes era una lista fija).
alter table public.categorias drop constraint if exists categorias_seccion_check;
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'categorias_seccion_fkey') then
    alter table public.categorias add constraint categorias_seccion_fkey
      foreign key (seccion) references public.secciones(id) on delete restrict;
  end if;
end $$;

create table if not exists public.ajustes (
  id        int primary key default 1 check (id = 1),
  whatsapp  text not null default '',
  horario   text not null default '',
  ubicacion text not null default '',
  aviso     text not null default ''
);
alter table public.ajustes add column if not exists personalizada_activa boolean not null default true;
insert into public.ajustes (id) values (1) on conflict (id) do nothing;

-- Quién es administrador (solo usuarios listados aquí pueden modificar datos).
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- ---------- Código de producto automático e inmutable ----------
-- Prefijo de la sección + consecutivo (PIN-0001, DUL-0001, GLO-0001…). Una vez asignado no cambia,
-- así el código que el cliente manda por WhatsApp siempre apunta al mismo producto.
create or replace function public.asignar_codigo()
returns trigger language plpgsql as $$
declare
  pref text;
  num  int;
begin
  if tg_op = 'UPDATE' then
    new.codigo := old.codigo;
  elsif new.codigo is null or new.codigo = '' then
    update public.secciones s set consecutivo = s.consecutivo + 1
    from public.categorias c
    where c.id = new.categoria_id and s.id = c.seccion
    returning s.prefijo, s.consecutivo into pref, num;
    if pref is null then
      raise exception 'La categoría no pertenece a ninguna sección';
    end if;
    new.codigo := pref || '-' || lpad(num::text, 4, '0');
  end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists productos_codigo on public.productos;
create trigger productos_codigo
  before insert or update on public.productos
  for each row execute function public.asignar_codigo();

-- El id y el prefijo de una sección no cambian, y su consecutivo nunca retrocede.
create or replace function public.proteger_seccion()
returns trigger language plpgsql as $$
begin
  new.id := old.id;
  new.prefijo := old.prefijo;
  new.consecutivo := greatest(new.consecutivo, old.consecutivo);
  return new;
end $$;

drop trigger if exists secciones_proteger on public.secciones;
create trigger secciones_proteger
  before update on public.secciones
  for each row execute function public.proteger_seccion();

-- ---------- Seguridad (Row Level Security) ----------
create or replace function public.es_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

alter table public.secciones  enable row level security;
alter table public.categorias enable row level security;
alter table public.productos  enable row level security;
alter table public.ajustes    enable row level security;
alter table public.admins     enable row level security;

-- Lectura pública del catálogo; escritura solo para administradores.
drop policy if exists "leer secciones" on public.secciones;
create policy "leer secciones" on public.secciones for select using (true);
drop policy if exists "admin secciones" on public.secciones;
create policy "admin secciones" on public.secciones for all to authenticated
  using (public.es_admin()) with check (public.es_admin());

drop policy if exists "leer categorias" on public.categorias;
create policy "leer categorias" on public.categorias for select using (true);
drop policy if exists "admin categorias" on public.categorias;
create policy "admin categorias" on public.categorias for all to authenticated
  using (public.es_admin()) with check (public.es_admin());

drop policy if exists "leer productos" on public.productos;
create policy "leer productos" on public.productos for select using (true);
drop policy if exists "admin productos" on public.productos;
create policy "admin productos" on public.productos for all to authenticated
  using (public.es_admin()) with check (public.es_admin());

drop policy if exists "leer ajustes" on public.ajustes;
create policy "leer ajustes" on public.ajustes for select using (true);
drop policy if exists "admin ajustes" on public.ajustes;
create policy "admin ajustes" on public.ajustes for all to authenticated
  using (public.es_admin()) with check (public.es_admin());

-- Cada usuario solo puede ver si él mismo es admin. Nadie puede escribir desde la web.
drop policy if exists "ver mi rol" on public.admins;
create policy "ver mi rol" on public.admins for select to authenticated using (user_id = auth.uid());

-- ---------- Almacenamiento de fotos ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('productos', 'productos', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = true, file_size_limit = 2097152, allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "admin sube fotos" on storage.objects;
create policy "admin sube fotos" on storage.objects for insert to authenticated
  with check (bucket_id = 'productos' and public.es_admin());
drop policy if exists "admin cambia fotos" on storage.objects;
create policy "admin cambia fotos" on storage.objects for update to authenticated
  using (bucket_id = 'productos' and public.es_admin());
drop policy if exists "admin borra fotos" on storage.objects;
create policy "admin borra fotos" on storage.objects for delete to authenticated
  using (bucket_id = 'productos' and public.es_admin());

-- ---------- Piñatas personalizadas ----------
-- El cliente llena el formulario y recibe un folio (PER-0001) que viaja en su mensaje de WhatsApp.
-- La foto de referencia NO se guarda aquí: el cliente la adjunta directamente en el chat.
create sequence if not exists public.consecutivo_per;

create table if not exists public.personalizadas (
  id           uuid primary key default gen_random_uuid(),
  folio        text not null unique default ('PER-' || lpad(nextval('public.consecutivo_per')::text, 4, '0')),
  diseno       text not null check (char_length(diseno) between 3 and 600),
  tamano       text not null check (tamano in ('chica', 'normal', 'grande')),
  detalles     text not null default '' check (char_length(detalles) <= 600),
  fecha_evento date,
  con_foto     boolean not null default false,
  estado       text not null default 'nueva' check (estado in ('nueva', 'cotizada', 'aceptada', 'entregada', 'cancelada')),
  created_at   timestamptz not null default now()
);

alter table public.personalizadas enable row level security;

-- Solo el administrador ve y modifica las solicitudes.
drop policy if exists "admin personalizadas" on public.personalizadas;
create policy "admin personalizadas" on public.personalizadas for all to authenticated
  using (public.es_admin()) with check (public.es_admin());

-- Los visitantes crean solicitudes solo a través de esta función, que devuelve el folio.
create or replace function public.crear_personalizada(
  p_diseno text, p_tamano text, p_detalles text, p_fecha_evento date, p_con_foto boolean
) returns text language plpgsql security definer set search_path = public as $$
declare
  nuevo_folio text;
begin
  insert into public.personalizadas (diseno, tamano, detalles, fecha_evento, con_foto)
  values (trim(p_diseno), p_tamano, coalesce(trim(p_detalles), ''), p_fecha_evento, coalesce(p_con_foto, false))
  returning folio into nuevo_folio;
  return nuevo_folio;
end $$;

revoke all on function public.crear_personalizada(text, text, text, date, boolean) from public;
grant execute on function public.crear_personalizada(text, text, text, date, boolean) to anon, authenticated;
