import { useTienda } from '../context/Tienda'

// Muestra un estado de carga o error mientras llega el catálogo.
export default function Cargando({ children }) {
  const { cargando, error, recargar } = useTienda()
  if (cargando) {
    return (
      <div className="estado-vacio contenedor">
        <div className="giro">🪅</div>
        <p>Colgando las piñatas…</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="estado-vacio contenedor">
        <p>😕 No pudimos cargar el catálogo.</p>
        <p className="texto-suave">{error}</p>
        <button className="btn btn-primario" onClick={recargar}>Reintentar</button>
      </div>
    )
  }
  return children
}
