# 🪅 ¡Dale Dale! — Piñatería & Dulcería

Catálogo web de piñatas y dulces con venta por WhatsApp y panel de administración (CRUD).

- **Tienda pública:** catálogo de piñatas y dulcería por categorías, buscador, detalle de producto,
  “Mi pedido” con varios productos y botón **Pedir por WhatsApp**.
- **Cada producto tiene un código único** (`PIN-0001` piñatas, `DUL-0001` dulces) que viaja en el
  mensaje de WhatsApp junto con el enlace al producto: cliente y vendedor saben exactamente de qué se habla.
- **Panel de administrador:** crear / editar / eliminar productos, subir fotos, marcar agotado u oculto,
  agregar o desactivar categorías y tipos de dulce, configurar número de WhatsApp, horario y aviso.

📖 **Guía de uso y capacitación:** [docs/GUIA-DE-USO.md](docs/GUIA-DE-USO.md)

## Tecnologías

| Parte | Tecnología |
|---|---|
| Interfaz | React 19 + Vite + React Router (rutas con `#` para GitHub Pages) |
| Base de datos, login y fotos | [Supabase](https://supabase.com) (PostgreSQL + Auth + Storage, plan gratuito) |
| Seguridad | Row Level Security: todos leen el catálogo; solo usuarios en la tabla `admins` escriben |
| Publicación | GitHub Actions → GitHub Pages |

Sin credenciales de Supabase la web arranca en **modo demostración** (datos en el navegador).

## Desarrollo local

```bash
npm install
cp .env.example .env   # opcional: llena tus datos de Supabase
npm run dev            # http://localhost:5173/
```

## Configurar Supabase (una sola vez)

1. Crea un proyecto gratuito en supabase.com.
2. **SQL Editor** → pega y ejecuta [`supabase/schema.sql`](supabase/schema.sql).
3. (Opcional) ejecuta [`supabase/seed.sql`](supabase/seed.sql) para cargar datos de prueba.
4. **Authentication → Sign In / Providers**: desactiva *Allow new users to sign up*.
5. **Authentication → Users → Add user**: crea tu usuario administrador (marca *Auto Confirm*).
6. **SQL Editor**, para darle permisos de administrador (cambia el correo):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'TU_CORREO_DE_ADMIN';
   ```
7. **Project Settings → API**: copia *Project URL* y la clave *anon / publishable* a tu `.env`.

## Publicar en GitHub Pages

1. En GitHub: **Settings → Pages → Source: GitHub Actions**.
2. **Settings → Secrets and variables → Actions → New repository secret**:
   `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
3. Cada `push` a `main` publica en `https://daledalepinatas.github.io/`.

> La clave *anon* es pública por diseño (viaja en el navegador); la seguridad la dan las políticas RLS.
> **Nunca** uses ni subas la clave `service_role`.

## Estructura

```
src/
  lib/api.js          capa de datos (Supabase o modo demo)
  lib/whatsapp.js     mensajes y enlaces wa.me con código de producto
  lib/datosDemo.js    datos de prueba genéricos (y fuente de supabase/seed.sql)
  pages/              tienda pública
  pages/admin/        panel de administración
supabase/             esquema SQL y datos de prueba
.github/workflows/    publicación automática
```

Fotos de muestra: [Unsplash](https://unsplash.com/license) (licencia gratuita). Reemplázalas por fotos reales.
