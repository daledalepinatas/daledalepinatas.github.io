import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTienda } from '../../context/Tienda'
import {
  cambiarEstadoPedido,
  cambiarEstadoPersonalizada,
  eliminarPedido,
  eliminarPersonalizada,
  listarPedidos,
  listarPersonalizadas,
} from '../../lib/api'
import { ESTADOS_PEDIDO, TAMANOS } from '../../lib/config'
import { normalizarBusqueda, precio } from '../../lib/formato'

const fechaCorta = (valor, conHora = false) =>
  new Date(conHora ? valor : `${valor}T12:00:00`).toLocaleString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(conHora && { hour: '2-digit', minute: '2-digit' }),
  })

const TIPOS = { catalogo: '🛒 Catálogo', personalizada: '✨ Personalizada' }

// Bandeja de pedidos: catálogo (PED-…) y personalizadas (PER-…) en una sola lista para confirmarlos.
export default function AdminPedidos() {
  const { notificar } = useTienda()
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [tipo, setTipo] = useState('')
  const [estado, setEstado] = useState('')

  const cargar = useCallback(async () => {
    try {
      const [catalogo, personalizadas] = await Promise.all([listarPedidos(), listarPersonalizadas()])
      const todos = [
        ...catalogo.map((p) => ({ ...p, clase: 'catalogo' })),
        ...personalizadas.map((s) => ({ ...s, clase: 'personalizada' })),
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      setPedidos(todos)
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
    return pedidos
      .filter((p) => !tipo || p.clase === tipo)
      .filter((p) => !estado || p.estado === estado)
      .filter((p) => {
        if (!q) return true
        const texto = p.clase === 'catalogo' ? p.items.map((i) => `${i.codigo} ${i.nombre}`).join(' ') : `${p.diseno} ${p.detalles}`
        return normalizarBusqueda(`${p.folio} ${texto}`).includes(q)
      })
  }, [pedidos, busqueda, tipo, estado])

  const sinConfirmar = pedidos.filter((p) => p.estado === 'nuevo').length

  const cambiarEstado = async (p, nuevo) => {
    try {
      await (p.clase === 'catalogo' ? cambiarEstadoPedido(p.id, nuevo) : cambiarEstadoPersonalizada(p.id, nuevo))
      await cargar()
      notificar(`${p.folio}: ${ESTADOS_PEDIDO[nuevo].emoji} ${ESTADOS_PEDIDO[nuevo].nombre}`)
    } catch (e) {
      notificar(e.message, 'error')
    }
  }

  const borrar = async (p) => {
    if (!confirm(`¿Eliminar el pedido ${p.folio}? Esta acción no se puede deshacer.`)) return
    try {
      await (p.clase === 'catalogo' ? eliminarPedido(p.id) : eliminarPersonalizada(p))
      await cargar()
      notificar('Pedido eliminado')
    } catch (e) {
      notificar(e.message, 'error')
    }
  }

  if (cargando) return <p className="estado-vacio">Cargando…</p>

  return (
    <section>
      <p className="texto-suave">
        Cada pedido llega con un <b>folio</b> en su mensaje de WhatsApp (<b>PED-</b> catálogo, <b>PER-</b> personalizada).
        Búscalo aquí y avanza su estado: el cliente lo ve en <Link to="/seguimiento">Consultar mi pedido</Link>.
        {sinConfirmar > 0 && <> Tienes <b>{sinConfirmar} sin confirmar</b>.</>}
      </p>
      <div className="admin-barra">
        <input
          type="search"
          placeholder="🔍 Buscar por folio, producto o diseño"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar pedido"
        />
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} aria-label="Tipo">
          <option value="">Todos los tipos</option>
          {Object.entries(TIPOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={estado} onChange={(e) => setEstado(e.target.value)} aria-label="Estado">
          <option value="">Todos los estados</option>
          {Object.entries(ESTADOS_PEDIDO).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.nombre}</option>)}
        </select>
        <button className="btn btn-claro" onClick={cargar}>↻ Actualizar</button>
      </div>

      {lista.length ? (
        <ul className="solicitudes">
          {lista.map((p) => (
            <li key={`${p.clase}-${p.id}`} className={`solicitud estado-${p.estado}`}>
              <div className="solicitud-cabecera">
                <span className="codigo">{p.folio}</span>
                <span className="etiqueta-tipo">{TIPOS[p.clase]}</span>
                <span className="texto-suave">{fechaCorta(p.created_at, true)}</span>
                <select
                  value={p.estado}
                  onChange={(e) => cambiarEstado(p, e.target.value)}
                  aria-label={`Estado de ${p.folio}`}
                  className="selector-estado"
                >
                  {Object.entries(ESTADOS_PEDIDO)
                    .filter(([, v]) => p.clase === 'personalizada' || !v.soloPersonalizada)
                    .map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.nombre}</option>)}
                </select>
                <button className="btn btn-mini btn-peligro" onClick={() => borrar(p)} aria-label={`Eliminar ${p.folio}`}>🗑️</button>
              </div>

              {p.clase === 'catalogo' ? (
                <>
                  <ul className="pedido-items-admin">
                    {p.items.map((i) => (
                      <li key={i.codigo}>
                        <span>{i.cantidad} × <Link to={`/p/${i.codigo}`}>{i.nombre}</Link> <small className="codigo codigo-linea">{i.codigo}</small></span>
                        <b>{precio(i.precio * i.cantidad)}</b>
                      </li>
                    ))}
                  </ul>
                  <p className="solicitud-total">Total estimado: <b>{precio(p.total)}</b></p>
                </>
              ) : (
                <>
                  <p><b>🎨 Diseño:</b> {p.diseno}</p>
                  <p className="solicitud-datos">
                    <span><b>📏</b> {TAMANOS[p.tamano]}</span>
                    {p.fecha_evento && <span><b>📅</b> Para el {fechaCorta(p.fecha_evento)}</span>}
                    {!p.foto_url && <span>{p.con_foto ? '📷 Enviará foto por WhatsApp' : 'Sin foto de referencia'}</span>}
                  </p>
                  {p.detalles && <p><b>📝 Detalles:</b> {p.detalles}</p>}
                  {p.foto_url && (
                    <a href={p.foto_url} target="_blank" rel="noreferrer" className="solicitud-foto" title="Ver foto de referencia completa">
                      <img src={p.foto_url} alt={`Foto de referencia de ${p.folio}`} loading="lazy" />
                      <span>📷 Foto de referencia</span>
                    </a>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="estado-vacio">
          {pedidos.length ? 'No hay pedidos con esos filtros.' : 'Todavía no hay pedidos. Aparecerán aquí cuando un cliente pida por WhatsApp.'}
        </p>
      )}
    </section>
  )
}
