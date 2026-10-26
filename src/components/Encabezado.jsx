import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTienda } from '../context/Tienda'
import { MODO_DEMO } from '../lib/api'
import { NEGOCIO } from '../lib/config'
import { URL_LOGO } from './Insignia'

export default function Encabezado() {
  const { ajustes, pedido, usuario, seccionesActivas, personalizadaVisible } = useTienda()
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
          <img className="logo-icono" src={URL_LOGO} alt="" />
          <span>
            <strong>{NEGOCIO.frase}</strong>
            <small>{NEGOCIO.fraseSecundaria}</small>
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
          {seccionesActivas.map((s) => (
            <NavLink key={s.id} to={`/${s.id}`}>{s.emoji} {s.nombre}</NavLink>
          ))}
          {personalizadaVisible && <NavLink to="/personalizada">✨ Personalizada</NavLink>}
          <NavLink to="/carrito" className="menu-pedido">
            🛒 Carrito {piezas > 0 && <span className="globo-numero">{piezas}</span>}
          </NavLink>
          {usuario?.esAdmin && <NavLink to="/admin">⚙️ Admin</NavLink>}
        </nav>
      </div>
    </header>
  )
}
