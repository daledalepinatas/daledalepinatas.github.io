import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTienda } from '../../context/Tienda'
import { cambiarEstadoPersonalizada, eliminarPersonalizada, listarPersonalizadas } from '../../lib/api'
import { ESTADOS_PERSONALIZADA, TAMANOS } from '../../lib/config'
import { normalizarBusqueda } from '../../lib/formato'

const fechaCorta = (valor, conHora = false) =>
  new Date(conHora ? valor : `${valor}T12:00:00`).toLocaleString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(conHora && { hour: '2-digit', minute: '2-digit' }),
  })

export default function AdminPersonalizadas() {
  const { notificar } = useTienda()
  const [solicitudes, setSolicitudes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState('')

  const cargar = useCallback(async () => {
    try {
      setSolicitudes(await listarPersonalizadas())
    } catch (e) {
      notificar(e.message, 'error')
    } finally {
      setCargando(false)
    }
  }, [notificar])

  useEffect(() => {
    cargar()
  }, [cargar])

  const lista = useMemo(() => {
    const q = normalizarBusqueda(busqueda)
    return solicitudes
      .filter((s) => !q || normalizarBusqueda(`${s.folio} ${s.diseno} ${s.detalles}`).includes(q))
      .filter((s) => !estado || s.estado === estado)
  }, [solicitudes, busqueda, estado])

  const cambiarEstado = async (s, nuevo) => {
    try {
      await cambiarEstadoPersonalizada(s.id, nuevo)
      await cargar()
      notificar(`${s.folio}: ${ESTADOS_PERSONALIZADA[nuevo]}`)
    } catch (e) {
      notificar(e.message, 'error')
    }
  }

  const borrar = async (s) => {
    if (!confirm(`¿Eliminar la solicitud ${s.folio}?`)) return
    try {
      await eliminarPersonalizada(s.id)
      await cargar()
      notificar('Solicitud eliminada')
    } catch (e) {
      notificar(e.message, 'error')
    }
  }

  if (cargando) return <p className="estado-vacio">Cargando…</p>

  return (
    <section>
      <p className="texto-suave">
        Cuando un cliente pide una piñata personalizada recibe un <b>folio</b> (ej. PER-0001) que aparece en su mensaje
        de WhatsApp. Búscalo aquí para ver lo que pidió. La foto de referencia te llega en el chat.
      </p>
      <div className="admin-barra">
        <input
          type="search"
          placeholder="🔍 Buscar por folio o diseño (ej. PER-0001)"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar solicitud"
        />
        <select value={estado} onChange={(e) => setEstado(e.target.value)} aria-label="Estado">
          <option value="">Todos los estados</option>
          {Object.entries(ESTADOS_PERSONALIZADA).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button className="btn btn-claro" onClick={cargar}>↻ Actualizar</button>
      </div>

      {lista.length ? (
        <ul className="solicitudes">
          {lista.map((s) => (
            <li key={s.id} className={`solicitud estado-${s.estado}`}>
              <div className="solicitud-cabecera">
                <span className="codigo">{s.folio}</span>
                <span className="texto-suave">Recibida: {fechaCorta(s.created_at, true)}</span>
                <select
                  value={s.estado}
                  onChange={(e) => cambiarEstado(s, e.target.value)}
                  aria-label={`Estado de ${s.folio}`}
                  className="selector-estado"
                >
                  {Object.entries(ESTADOS_PERSONALIZADA).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <button className="btn btn-mini btn-peligro" onClick={() => borrar(s)} aria-label={`Eliminar ${s.folio}`}>🗑️</button>
              </div>
              <p><b>🎨 Diseño:</b> {s.diseno}</p>
              <p className="solicitud-datos">
                <span><b>📏</b> {TAMANOS[s.tamano]}</span>
                {s.fecha_evento && <span><b>📅</b> Para el {fechaCorta(s.fecha_evento)}</span>}
                <span>{s.con_foto ? '📷 Enviará foto por WhatsApp' : 'Sin foto de referencia'}</span>
              </p>
              {s.detalles && <p><b>✨ Detalles:</b> {s.detalles}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="estado-vacio">
          {solicitudes.length ? 'No hay solicitudes con esos filtros.' : 'Todavía no hay solicitudes de piñatas personalizadas.'}
        </p>
      )}
    </section>
  )
}
