import { Link, useLocation } from 'react-router-dom'
import { useTienda } from '../context/Tienda'

export default function BotonPedido() {
  const { pedido } = useTienda()
  const { pathname } = useLocation()
  const piezas = pedido.reduce((s, i) => s + i.cantidad, 0)
  if (!piezas || pathname === '/pedido') return null
  return (
    <Link to="/pedido" className="boton-flotante" aria-label={`Ver mi pedido, ${piezas} piezas`}>
      🛍️ <span>Mi pedido</span> <b>{piezas}</b>
    </Link>
  )
}
