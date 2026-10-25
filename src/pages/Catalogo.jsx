import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTienda } from '../context/Tienda'
import { SECCIONES } from '../lib/config'
import { normalizarBusqueda } from '../lib/formato'
import TarjetaProducto from '../components/TarjetaProducto'
import ChipsSeccion from '../components/ChipsSeccion'
import Cargando from '../components/Cargando'

const ORDENES = {
  relevancia: { nombre: 'Destacados primero', fn: (a, b) => b.destacado - a.destacado || a.codigo.localeCompare(b.codigo) },
  menor: { nombre: 'Precio: menor a mayor', fn: (a, b) => a.precio - b.precio },
  mayor: { nombre: 'Precio: mayor a menor', fn: (a, b) => b.precio - a.precio },
  nombre: { nombre: 'Nombre (A-Z)', fn: (a, b) => a.nombre.localeCompare(b.nombre) },
}

export default function Catalogo({ seccion }) {
  const { slug } = useParams()
  const { categoriasActivas, publicos } = useTienda()
  const [busqueda, setBusqueda] = useState('')
  const [orden, setOrden] = useState('relevancia')
  const sec = SECCIONES[seccion]

  const categorias = categoriasActivas.filter((c) => c.seccion === seccion)
  const actual = categorias.find((c) => c.slug === slug)

  const lista = useMemo(() => {
    const q = normalizarBusqueda(busqueda)
    return publicos
      .filter((p) => p.categoria.seccion === seccion)
      .filter((p) => !actual || p.categoria_id === actual.id)
      .filter((p) => !q || normalizarBusqueda(`${p.nombre} ${p.codigo} ${p.descripcion}`).includes(q))
      .sort(ORDENES[orden].fn)
  }, [publicos, seccion, actual, busqueda, orden])

  return (
    <div className="contenedor seccion">
      <h1 className="titulo-pagina">
        {sec.emoji} {actual ? actual.nombre : sec.nombre}
      </h1>
      <Cargando>
        <ChipsSeccion seccion={seccion} actual={actual || null} />

        <div className="filtros">
          <input
            type="search"
            placeholder="Buscar por nombre o código (ej. PIN-0001)"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar productos"
          />
          <select value={orden} onChange={(e) => setOrden(e.target.value)} aria-label="Ordenar">
            {Object.entries(ORDENES).map(([k, o]) => <option key={k} value={k}>{o.nombre}</option>)}
          </select>
        </div>

        {slug && !actual ? (
          <div className="estado-vacio">
            <p>Esta categoría ya no está disponible.</p>
            <Link to={sec.ruta} className="btn btn-primario">Ver todo</Link>
          </div>
        ) : lista.length ? (
          <div className="rejilla">
            {lista.map((p) => <TarjetaProducto key={p.id} producto={p} />)}
          </div>
        ) : (
          <div className="estado-vacio">
            <p>🔍 No encontramos productos{busqueda && ` con “${busqueda}”`}.</p>
            <p className="texto-suave">¿Buscas algo especial? Pregúntanos por WhatsApp.</p>
          </div>
        )}
      </Cargando>
    </div>
  )
}
