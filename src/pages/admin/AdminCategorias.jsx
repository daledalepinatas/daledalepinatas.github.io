import { useState } from 'react'
import { useTienda } from '../../context/Tienda'
import { eliminarCategoria, guardarCategoria } from '../../lib/api'
import { SECCIONES } from '../../lib/config'

export default function AdminCategorias() {
  const { categorias, productos, recargar, notificar } = useTienda()
  const [nueva, setNueva] = useState({ nombre: '', emoji: '', seccion: 'dulceria' })
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
    const orden = Math.max(0, ...categorias.filter((c) => c.seccion === nueva.seccion).map((c) => c.orden)) + 1
    const ok = await ejecutar(() => guardarCategoria({ ...nueva, orden, activa: true }), `Categoría “${nueva.nombre}” creada`)
    if (ok) setNueva({ ...nueva, nombre: '', emoji: '' })
  }

  const mover = (lista, indice, delta) => {
    const a = lista[indice]
    const b = lista[indice + delta]
    if (!b) return
    ejecutar(async () => {
      await guardarCategoria({ ...a, orden: b.orden })
      await guardarCategoria({ ...b, orden: a.orden })
    }, 'Orden actualizado')
  }

  return (
    <section>
      <form className="tarjeta-form form-linea" onSubmit={crear}>
        <h2>➕ Agregar categoría o tipo de dulce</h2>
        <div className="form-fila">
          <label>
            Sección
            <select value={nueva.seccion} onChange={(e) => setNueva({ ...nueva, seccion: e.target.value })}>
              {Object.values(SECCIONES).map((s) => <option key={s.id} value={s.id}>{s.emoji} {s.nombre}</option>)}
            </select>
          </label>
          <label className="campo-emoji">
            Emoji
            <input maxLength={4} value={nueva.emoji} onChange={(e) => setNueva({ ...nueva, emoji: e.target.value })} placeholder="🍬" />
          </label>
          <label className="crece">
            Nombre *
            <input required maxLength={60} value={nueva.nombre} onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })} placeholder="Ej. Mazapanes" />
          </label>
          <button className="btn btn-primario">Agregar</button>
        </div>
      </form>

      <p className="texto-suave">
        💡 ¿Ya no vendes un tipo de dulce o piñata? Usa <b>“Ya no se vende”</b>: se oculta de la tienda junto con sus productos
        y puedes reactivarlo cuando quieras. <b>Eliminar</b> solo es posible si la categoría no tiene productos.
      </p>

      <div className="columnas-categorias">
        {Object.values(SECCIONES).map((s) => {
          const lista = categorias.filter((c) => c.seccion === s.id).sort((a, b) => a.orden - b.orden)
          return (
            <div key={s.id}>
              <h2>{s.emoji} {s.nombre}</h2>
              <ul className="lista-categorias">
                {lista.map((c, i) => {
                  const cuantos = productos.filter((p) => p.categoria_id === c.id).length
                  const enEdicion = editando?.id === c.id
                  return (
                    <li key={c.id} className={c.activa ? '' : 'inactiva'}>
                      <div className="orden-botones">
                        <button onClick={() => mover(lista, i, -1)} disabled={i === 0} aria-label="Subir">▲</button>
                        <button onClick={() => mover(lista, i, 1)} disabled={i === lista.length - 1} aria-label="Bajar">▼</button>
                      </div>
                      {enEdicion ? (
                        <form
                          className="edicion-categoria"
                          onSubmit={async (e) => {
                            e.preventDefault()
                            if (await ejecutar(() => guardarCategoria(editando), 'Categoría actualizada')) setEditando(null)
                          }}
                        >
                          <input className="campo-emoji" maxLength={4} value={editando.emoji} onChange={(e) => setEditando({ ...editando, emoji: e.target.value })} aria-label="Emoji" />
                          <input required maxLength={60} value={editando.nombre} onChange={(e) => setEditando({ ...editando, nombre: e.target.value })} aria-label="Nombre" />
                          <button className="btn btn-mini">Guardar</button>
                          <button type="button" className="btn btn-mini btn-claro" onClick={() => setEditando(null)}>Cancelar</button>
                        </form>
                      ) : (
                        <>
                          <span className="categoria-nombre">
                            {c.emoji} {c.nombre}
                            <small>{cuantos} producto{cuantos === 1 ? '' : 's'}</small>
                          </span>
                          <label className="interruptor" title={c.activa ? 'Se muestra en la tienda' : 'Oculta en la tienda'}>
                            <input
                              type="checkbox"
                              checked={c.activa}
                              onChange={() => ejecutar(() => guardarCategoria({ ...c, activa: !c.activa }), c.activa ? `“${c.nombre}” ya no se muestra` : `“${c.nombre}” vuelve a la tienda`)}
                            />
                            <span>{c.activa ? 'Se vende' : 'Ya no se vende'}</span>
                          </label>
                          <button className="btn btn-mini btn-claro" onClick={() => setEditando({ ...c })} aria-label={`Editar ${c.nombre}`}>✏️</button>
                          <button
                            className="btn btn-mini btn-peligro"
                            disabled={cuantos > 0}
                            title={cuantos > 0 ? 'Primero elimina o mueve sus productos' : 'Eliminar'}
                            onClick={() => confirm(`¿Eliminar la categoría “${c.nombre}”?`) && ejecutar(() => eliminarCategoria(c.id), 'Categoría eliminada')}
                            aria-label={`Eliminar ${c.nombre}`}
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
