# 📘 Guía de uso — ¡Dale Dale! Piñatería & Dulcería

Esta guía es tu capacitación. Está dividida en tres partes:

1. [Lo que ve tu cliente](#1-lo-que-ve-tu-cliente)
2. [Tu panel de administrador](#2-tu-panel-de-administrador)
3. [Cómo atender un pedido por WhatsApp](#3-cómo-atender-un-pedido-por-whatsapp)

Al final hay [preguntas frecuentes](#preguntas-frecuentes).

---

## 1. Lo que ve tu cliente

| Sección | Para qué sirve |
|---|---|
| **Inicio** | Una piñata que se puede “golpear” (5 golpes y suelta dulces 🎉), las categorías, los productos favoritos y los pasos para pedir. |
| **🪅 Piñatas** | Primero **✨ Personalizada**, luego las categorías: 🔤 Letras, 🔢 Números y ⭐ De picos. |
| **✨ Personalizada** | Formulario: diseño que busca, foto de referencia, tamaño (Chica 50 cm · Normal 90 cm · Grande 90 cm en adelante), fecha y detalles. Le da un **folio** (`PER-0001`) y abre WhatsApp con todo escrito. |
| **🍬 Dulcería** | Gomitas, paletas, chocolates, enchilados, bombones, bolsitas para relleno… (tú decides cuáles). |
| **Detalle de producto** | Foto, **código**, precio, tamaño, descripción y botones *Pedir por WhatsApp*, *Agregar a mi pedido* y *Compartir enlace*. |
| **🛍️ Mi pedido** | El cliente junta varias piñatas y dulces, ajusta cantidades y manda **un solo mensaje** con todo. |

Cada producto tiene un **código** que nunca cambia:

- `PIN-0001`, `PIN-0002`, … → piñatas
- `DUL-0001`, `DUL-0002`, … → dulcería
- `PER-0001`, `PER-0002`, … → solicitudes de piñata personalizada

---

## 2. Tu panel de administrador

### Entrar

1. Abre la tienda y al final de la página toca **“Acceso administrador”** (o ve a `daledalepinatas.github.io/#/admin`).
2. Escribe tu correo y contraseña de administrador.
3. Verás el botón **⚙️ Admin** en el menú mientras tengas la sesión abierta.
4. Al terminar, toca **Cerrar sesión** (sobre todo en computadoras compartidas).

> En **modo demostración** (banda amarilla arriba) entras sin contraseña y los cambios solo se guardan
> en ese navegador. Úsalo para practicar; con **↺ Restaurar demo** vuelves a los datos de prueba.

### Pestaña 🪅 Productos

- **Buscar:** escribe el código que te mandó el cliente (ej. `PIN-0004`) o parte del nombre.
- **Filtrar** por sección, categoría o estado.
- **+ Nuevo producto:**
  1. Nombre, categoría y precio (obligatorios).
  2. Tamaño / presentación (ej. “80 cm” o “Bolsa de 1 kg”) y descripción.
  3. Foto: **📷 Subir foto** desde el celular o la PC (se reduce sola) o pega la URL de una imagen.
  4. ⭐ *Mostrar en favoritos* para que salga en la página de inicio.
  5. **💾 Guardar.** El código se asigna solo.
- **✏️ Editar:** cambia precio, foto, descripción… El código **no cambia**.
- **Estado** (menú en cada fila), se guarda al instante:
  - **Disponible:** se puede pedir.
  - **Agotado:** se ve en gris, el cliente solo puede preguntar cuándo vuelve.
  - **Oculto:** no aparece en la tienda (útil para temporadas, ej. Halloween).
- **🗑️ Eliminar:** borra el producto para siempre. Si solo se acabó, mejor márcalo *Agotado* u *Oculto*.
- **👁️** abre el producto tal como lo ve el cliente.

### Pestaña ✨ Personalizadas

- Cada vez que un cliente llena el formulario de piñata personalizada, aparece aquí con su **folio**,
  diseño, tamaño, fecha y detalles.
- **La foto de referencia no se guarda en la web:** el cliente la adjunta en el chat de WhatsApp.
  Busca el folio del mensaje aquí para ver el resto de su pedido.
- Cambia el **estado** conforme avanza: Nueva → Cotizada → Aceptada → Entregada (o Cancelada).
- **↻ Actualizar** trae las solicitudes más recientes.

### Pestaña 🧭 Secciones

Las **secciones** son los apartados del menú (🪅 Piñatas, 🍬 Dulcería…). Cada una tiene sus categorías y productos.

- **✨ Aceptar pedidos de piñatas personalizadas:** apágalo cuando no puedas tomar pedidos especiales
  (por ejemplo en temporada alta). Desaparece del menú y del catálogo; vuelve a encenderlo cuando quieras.
- **Nueva sección:** escribe el nombre (ej. “Globos”), un emoji, una imagen (se ve en el inicio) y un
  **código de 3 letras** (se sugiere solo: Globos → `GLO`). Sus productos se llamarán `GLO-0001`, `GLO-0002`…
  ⚠️ El código no se puede cambiar después, para que los mensajes de WhatsApp sigan siendo válidos.
- **Visible / Oculta:** oculta una sección completa (con sus categorías y productos) sin borrar nada.
- **✏️** cambia nombre, emoji o imagen. **▲ ▼** cambian el orden en el menú.
- **🗑️ Eliminar** solo se activa si la sección no tiene categorías.

Después de crear una sección, ve a **🗂️ Categorías** para agregarle categorías y luego a **🪅 Productos**.

### Pestaña 🗂️ Categorías (y tipos de dulce)

- **Agregar:** elige la sección (Piñatas o Dulcería), un emoji y el nombre → **Agregar**.
  Ej.: sección *Dulcería*, 🥜, “Mazapanes”.
- **¿Ya no vendes un tipo de dulce?** Desmarca **“Se vende”** → queda en **“Ya no se vende”**:
  la categoría y todos sus productos desaparecen de la tienda, pero no se borra nada. Reactívala cuando quieras.
- **✏️** cambia nombre o emoji. **▲ ▼** cambian el orden en que aparecen.
- **🗑️ Eliminar** solo se activa si la categoría está vacía (sin productos).

### Pestaña 💬 WhatsApp y ajustes

- **Número de WhatsApp:** el que recibe los pedidos. Escribe los 10 dígitos; la web agrega el +52.
  Toca **Probar enlace** para comprobar que abre tu chat.
- **Horario** y **zona de entrega:** aparecen al pie de la página.
- **Aviso superior:** franja morada arriba de la tienda (ej. “Envío gratis en pedidos mayores a $800”).
  Déjalo vacío para ocultarla.

---

## 3. Cómo atender un pedido por WhatsApp

Una **piñata personalizada** llega así (y después el cliente manda la foto en el mismo chat):

```
¡Hola, Dale Dale! Quiero una piñata personalizada:

🔖 Folio: PER-0001
🎨 Diseño: Dinosaurio verde con el nombre Sofía
📏 Tamaño: Normal (90 cm)
✨ Detalles: Con flecos dorados
📷 En seguida te envío la foto de referencia por este chat.
```


Cuando un cliente toca **Pedir por WhatsApp** te llega algo así:

```
¡Hola, Dale Dale! Me interesa este producto:

🪅 Piñata Estrella 7 picos
🔖 Código: PIN-0001
💲 Precio: $350.00 MXN
🔗 https://daledalepinatas.github.io/#/p/PIN-0001

¿Está disponible?
```

Y si usó **Mi pedido**:

```
¡Hola, Dale Dale! Quiero hacer este pedido:

• 1 x Piñata Estrella 7 picos [PIN-0001] — $350.00 MXN
• 2 x Gomitas surtidas [DUL-0001] — $190.00 MXN

Total estimado: $540.00 MXN
```

**Qué hacer:**

1. Toca el enlace 🔗 o busca el **código** en tu panel → ves la foto y el precio exactos.
2. Confirma disponibilidad, personalización (número, letra, colores), fecha de entrega y forma de pago.
3. Si se te acaba, márcalo **Agotado** en el panel para que nadie más lo pida.

> 💡 El precio del mensaje es el de la web en ese momento. Si cambias un precio, los nuevos mensajes
> ya salen con el precio nuevo.

---

## Preguntas frecuentes

**¿Puedo cambiar el nombre del negocio?**
Sí, en `src/lib/config.js` (requiere publicar de nuevo).

**¿Quién puede modificar el catálogo?**
Solo usuarios en la tabla `admins` de Supabase. Aunque alguien obtenga la dirección del panel, sin tu
contraseña no puede cambiar nada: la base de datos lo bloquea.

**Olvidé mi contraseña.**
En Supabase: *Authentication → Users →* tu usuario *→ Send password recovery* (o cámbiala ahí mismo).

**¿Las fotos de prueba se pueden usar?**
Son de Unsplash con licencia gratuita, pero no son tus productos. Reemplázalas por fotos reales.

**¿Cuánto cuesta?**
GitHub Pages y el plan gratuito de Supabase cuestan $0. Un proyecto gratuito de Supabase se
pausa tras ~1 semana sin visitas; se reactiva desde el panel de Supabase.
