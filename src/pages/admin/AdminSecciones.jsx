import { useState } from 'react'
import { useTienda } from '../../context/Tienda'
import { eliminarSeccion, guardarAjustes, guardarSeccion, idParaSeccion, subirImagen } from '../../lib/api'
import { PERSONALIZADA } from '../../lib/config'
import { slugify } from '../../lib/formato'
import Imagen from '../../components/Imagen'

const VACIA = { nombre: '', emoji: '', prefijo: '', imagen_url: '' }
const sugerirPrefijo = (nombre) => slugify(nombre).replace(/[^a-z]/g, '').slice(0, 3).toUpperCase()

// Campo de imagen reutilizable: subir desde el dispositivo o pegar una URL.
function CampoImagen({ valor, onCambio }) {
  const { notificar } = useTienda()
  const [subiendo, setSubiendo] = useState(false)
  const elegir = async (e) => {
    const archivo = e.target.files?.[0]
    e.target.value = ''
    if (!archivo) return
    setSubiendo(true)
    try {
      onCambio(await subirImagen(archivo))
    } catch (err) {
      notificar(err.message, 'error')
    } finally {
      setSubiendo(false)
    }
  }
  return (
    <div className="campo-imagen">
      <div className="miniatura-seccion"><Imagen src={valor} alt="Imagen de la sección" /></div>
      <div className="campo-imagen-acciones">
        <label className="btn btn-mini btn-claro subir">
          {subiendo ? 'Subiendo…' : '📷 Subir imagen'}
          <input type="file" accept="image/*" onChange={elegir} disabled={subiendo} hidden />
        </label>
        <input
          type="url"
          placeholder="…o pega la URL de una imagen"
          value={valor.startsWith('data:') ? '' : valor}
          onChange={(e) => onCambio(e.target.value)}
          aria-label="URL de la imagen"
        />
      </div>
    </div>
  )
}

export default function AdminSecciones() {
  const { secciones, categorias, productos, ajustes, personalizadaVisible, recargar, notificar } = useTienda()
  const [nueva, setNueva] = useState(VACIA)
  const [prefijoEditado, setPrefijoEditado] = useState(false)
  const [editando, setEditando] = useState(null)

  const ejecutar = async (accion, mensaje) => {
    try {
      await accion()
      await recargar()
      notificar(mensaje)
      return true
    } catch (e) {
      notificar(e.message, 'error')
      return false
    }
  }

  const crear = async (e) => {
    e.preventDefault()
    const seccion = {
      ...nueva,
      id: idParaSeccion(nueva.nombre, secciones),
      orden: Math.max(0, ...secciones.map((s) => s.orden)) + 1,
      activa: true,
    }
    if (await ejecutar(() => guardarSeccion(seccion, true), `Sección “${nueva.nombre}” creada`)) {
      setNueva(VACIA)
      setPrefijoEditado(false)
    }
  }

  const mover = (indice, delta) => {
    const a = secciones[indice]
    const b = secciones[indice + delta]
    if (!b) return
    ejecutar(async () => {
      await guardarSeccion({ ...a, orden: b.orden }, false)
      await guardarSeccion({ ...b, orden: a.orden }, false)
    }, 'Orden actualizado')
  }

  return (
    <section>
      <div className="tarjeta-form interruptor-personalizada">
        <label className="interruptor interruptor-grande">
          <input
            type="checkbox"
            checked={personalizadaVisible}
            onChange={() =>
              ejecutar(
                () => guardarAjustes({ ...ajustes, personalizada_activa: !personalizadaVisible }),
                personalizadaVisible ? 'Personalizada oculta' : 'Personalizada visible de nuevo',
              )
            }
          />
          <span>
            <b>{PERSONALIZADA.emoji} Aceptar pedidos de piñatas personalizadas</b>
            <small>{personalizadaVisible ? 'Se muestra en el menú y en Piñatas.' : 'Oculta: nadie puede enviar solicitudes.'}</small>
          </span>
        </label>
      </div>

      <form className="tarjeta-form" onSubmit={crear}>
        <h2>➕ Nueva sección</h2>
        <p className="texto-suave">
          Una sección es un apartado del menú (como Piñatas o Dulcería) con sus propias categorías y productos.
        </p>
        <div className="form-fila">
          <label className="campo-emoji">
            Emoji
            <input maxLength={4} value={nueva.emoji} onChange={(e) => setNueva({ ...nueva, emoji: e.target.value })} placeholder="🎈" />
          </label>
          <label className="crece">
            Nombre *
            <input
              required
              maxLength={40}
              value={nueva.nombre}
              placeholder="Ej. Globos"
              onChange={(e) =>
                setNueva({
                  ...nueva,
                  nombre: e.target.value,
                  prefijo: prefijoEditado ? nueva.prefijo : sugerirPrefijo(e.target.value),
                })
              }
            />
          </label>
          <label className="campo-prefijo">
            Código *
            <input
              required
              maxLength={3}
              pattern="[A-Za-z]{3}"
              title="Exactamente 3 letras"
              value={nueva.prefijo}
              onChange={(e) => {
                setPrefijoEditado(true)
                setNueva({ ...nueva, prefijo: e.target.value.toUpperCase().replace(/[^A-Z]/g, '') })
              }}
              placeholder="GLO"
            />
          </label>
        </div>
        <p className="texto-suave nota">
          Los productos de esta sección se llamarán <b>{nueva.prefijo || '???'}-0001</b>, <b>{nueva.prefijo || '???'}-0002</b>…
          El código no se puede cambiar después.
        </p>
        <CampoImagen valor={nueva.imagen_url} onCambio={(url) => setNueva({ ...nueva, imagen_url: url })} />
        <button className="btn btn-primario">Crear sección</button>
      </form>

      <p className="texto-suave">
        💡 ¿No tienes productos de una sección por un tiempo? Desmarca <b>“Visible”</b>: se oculta del menú junto con sus
        categorías y productos, sin borrar nada. <b>Eliminar</b> solo es posible si la sección no tiene categorías.
      </p>

      <ul className="lista-secciones">
        {secciones.map((s, i) => {
          const cats = categorias.filter((c) => c.seccion === s.id)
          const prods = productos.filter((p) => p.categoria?.seccion === s.id).length
          const enEdicion = editando?.id === s.id
          return (
            <li key={s.id} className={s.activa ? '' : 'inactiva'}>
              <div className="orden-botones">
                <button onClick={() => mover(i, -1)} disabled={i === 0} aria-label="Subir">▲</button>
                <button onClick={() => mover(i, 1)} disabled={i === secciones.length - 1} aria-label="Bajar">▼</button>
              </div>
              {enEdicion ? (
                <form
                  className="edicion-seccion"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    if (await ejecutar(() => guardarSeccion(editando, false), 'Sección actualizada')) setEditando(null)
                  }}
                >
                  <div className="form-fila">
                    <input className="campo-emoji" maxLength={4} value={editando.emoji} onChange={(e) => setEditando({ ...editando, emoji: e.target.value })} aria-label="Emoji" />
                    <input className="crece" required maxLength={40} value={editando.nombre} onChange={(e) => setEditando({ ...editando, nombre: e.target.value })} aria-label="Nombre" />
                  </div>
                  <CampoImagen valor={editando.imagen_url} onCambio={(url) => setEditando({ ...editando, imagen_url: url })} />
                  <div className="acciones">
                    <button className="btn btn-mini">Guardar</button>
                    <button type="button" className="btn btn-mini btn-claro" onClick={() => setEditando(null)}>Cancelar</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="miniatura-seccion"><Imagen src={s.imagen_url} alt={s.nombre} /></div>
                  <span className="categoria-nombre">
                    {s.emoji} {s.nombre}
                    <small>
                      <span className="codigo codigo-linea">{s.prefijo}</span> · /{s.id} · {cats.length} categoría{cats.length === 1 ? '' : 's'} · {prods} producto{prods === 1 ? '' : 's'}
                    </small>
                  </span>
                  <label className="interruptor" title={s.activa ? 'Se muestra en la tienda' : 'Oculta en la tienda'}>
                    <input
                      type="checkbox"
                      checked={s.activa}
                      onChange={() => ejecutar(() => guardarSeccion({ ...s, activa: !s.activa }, false), s.activa ? `“${s.nombre}” oculta` : `“${s.nombre}” visible de nuevo`)}
                    />
                    <span>{s.activa ? 'Visible' : 'Oculta'}</span>
                  </label>
                  <button className="btn btn-mini btn-claro" onClick={() => setEditando({ ...s })} aria-label={`Editar ${s.nombre}`}>✏️</button>
                  <button
                    className="btn btn-mini btn-peligro"
                    disabled={cats.length > 0}
                    title={cats.length > 0 ? 'Primero elimina o mueve sus categorías' : 'Eliminar'}
                    onClick={() => confirm(`¿Eliminar la sección “${s.nombre}”?`) && ejecutar(() => eliminarSeccion(s.id), 'Sección eliminada')}
                    aria-label={`Eliminar ${s.nombre}`}
                  >
                    🗑️
                  </button>
                </>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
