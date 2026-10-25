import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTienda } from '../../context/Tienda'
import { cambiarEstadoProducto, eliminarProducto } from '../../lib/api'
import { ESTADOS } from '../../lib/config'
import { normalizarBusqueda, precio } from '../../lib/formato'
import Imagen from '../../components/Imagen'

export default function AdminProductos() {
  const { productos, categorias, secciones, recargar, notificar } = useTienda()
  const [busqueda, setBusqueda] = useState('')
  const [seccion, setSeccion] = useState('')
  const [categoria, setCategoria] = useState('')
  const [estado, setEstado] = useState('')

  const lista = useMemo(() => {
    const q = normalizarBusqueda(busqueda)
    return productos
      .filter((p) => !q || normalizarBusqueda(`${p.codigo} ${p.nombre}`).includes(q))
      .filter((p) => !seccion || p.categoria?.seccion === seccion)
      .filter((p) => !categoria || p.categoria_id === categoria)
      .filter((p) => !estado || p.estado === estado)
      .sort((a, b) => a.codigo.localeCompare(b.codigo))
  }, [productos, busqueda, seccion, categoria, estado])

  const cambiarEstado = async (p, nuevo) => {
    try {
      await cambiarEstadoProducto(p.id, nuevo)
      await recargar()
      notificar(`${p.codigo}: ${ESTADOS[nuevo]}`)
    } catch (e) {
      notificar(e.message, 'error')
    }
  }

  const borrar = async (p) => {
    if (!confirm(`¿Eliminar definitivamente “${p.nombre}” (${p.codigo})?\n\nSi solo no lo tienes por ahora, mejor márcalo como Agotado u Oculto.`)) return
    try {
      await eliminarProducto(p)
      await recargar()
      notificar('Producto eliminado')
    } catch (e) {
      notificar(e.message, 'error')
    }
  }

  return (
    <section>
      <div className="admin-barra">
        <input
          type="search"
          placeholder="🔍 Buscar por código o nombre (ej. PIN-0004)"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar producto"
        />
        <select value={seccion} onChange={(e) => { setSeccion(e.target.value); setCategoria('') }} aria-label="Sección">
          <option value="">Todas las secciones</option>
          {secciones.map((s) => <option key={s.id} value={s.id}>{s.emoji} {s.nombre}{s.activa ? '' : ' (oculta)'}</option>)}
        </select>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} aria-label="Categoría">
          <option value="">Todas las categorías</option>
          {categorias
            .filter((c) => !seccion || c.seccion === seccion)
            .map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>)}
        </select>
        <select value={estado} onChange={(e) => setEstado(e.target.value)} aria-label="Estado">
          <option value="">Todos los estados</option>
          {Object.entries(ESTADOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <Link to="/admin/nuevo" className="btn btn-primario">+ Nuevo producto</Link>
      </div>

      <p className="texto-suave">{lista.length} de {productos.length} productos</p>

      <ul className="admin-lista">
        {lista.map((p) => (
          <li key={p.id} className={`admin-fila estado-${p.estado}`}>
            <Imagen src={p.imagen_url} alt={p.nombre} className="admin-foto" />
            <div className="admin-datos">
              <span className="codigo codigo-linea">{p.codigo}</span>
              <b>{p.nombre}</b> {p.destacado && <span title="Destacado">⭐</span>}
              <span className="texto-suave">
                {p.categoria ? `${p.categoria.emoji} ${p.categoria.nombre}` : 'Sin categoría'}
                {p.categoria && !p.categoria.activa && ' (categoría desactivada)'}
                {p.categoria?.seccionInfo && !p.categoria.seccionInfo.activa && ' (sección oculta)'}
              </span>
            </div>
            <b className="admin-precio">{precio(p.precio)}</b>
            <select
              value={p.estado}
              onChange={(e) => cambiarEstado(p, e.target.value)}
              aria-label={`Estado de ${p.codigo}`}
              className={`selector-estado ${p.estado}`}
            >
              {Object.entries(ESTADOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <div className="admin-botones">
              <Link to={`/p/${p.codigo}`} className="btn btn-mini btn-claro" title="Ver como cliente">👁️</Link>
              <Link to={`/admin/editar/${p.id}`} className="btn btn-mini">✏️ Editar</Link>
              <button className="btn btn-mini btn-peligro" onClick={() => borrar(p)}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>
      {!lista.length && <p className="estado-vacio">No hay productos con esos filtros.</p>}
    </section>
  )
}
