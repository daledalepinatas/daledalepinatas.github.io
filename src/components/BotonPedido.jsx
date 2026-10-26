import { Link, useLocation } from 'react-router-dom'
import { useTienda } from '../context/Tienda'

export default function BotonPedido() {
  const { pedido } = useTienda()
  const { pathname } = useLocation()
  const piezas = pedido.reduce((s, i) => s + i.cantidad, 0)
  if (!piezas || pathname === '/carrito') return null
  return (
    <Link to="/carrito" className="boton-flotante" aria-label={`Ver mi carrito, ${piezas} piezas`}>
      🛒 <span>Carrito</span> <b>{piezas}</b>
    </Link>
  )
}
