import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTienda } from '../context/Tienda'
import { MODO_DEMO } from '../lib/api'
import { NEGOCIO } from '../lib/config'

export default function Encabezado() {
  const { ajustes, pedido, usuario } = useTienda()
  const [abierto, setAbierto] = useState(false)
  const piezas = pedido.reduce((s, i) => s + i.cantidad, 0)
  const cerrar = () => setAbierto(false)

  return (
    <header className="encabezado">
      {MODO_DEMO && (
        <div className="franja franja-demo">
          Modo demostración: los cambios se guardan solo en este navegador.
        </div>
      )}
      {ajustes.aviso && <div className="franja">{ajustes.aviso}</div>}
      <div className="papel-picado" aria-hidden="true" />
      <div className="barra contenedor">
        <Link to="/" className="logo" onClick={cerrar}>
          <span className="logo-icono" aria-hidden="true">🪅</span>
          <span>
            <strong>{NEGOCIO.nombre}</strong>
            <small>{NEGOCIO.subtitulo}</small>
          </span>
        </Link>
        <button
          className="menu-boton"
          aria-expanded={abierto}
          aria-label="Abrir menú"
          onClick={() => setAbierto(!abierto)}
        >
          {abierto ? '✕' : '☰'}
        </button>
        <nav className={`menu ${abierto ? 'abierto' : ''}`} onClick={cerrar}>
          <NavLink to="/" end>Inicio</NavLink>
          <NavLink to="/pinatas">🪅 Piñatas</NavLink>
          <NavLink to="/dulceria">🍬 Dulcería</NavLink>
          <NavLink to="/pedido" className="menu-pedido">
            🛍️ Mi pedido {piezas > 0 && <span className="globo-numero">{piezas}</span>}
          </NavLink>
          {usuario?.esAdmin && <NavLink to="/admin">⚙️ Admin</NavLink>}
        </nav>
      </div>
    </header>
  )
}
