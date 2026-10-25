import { Link } from 'react-router-dom'
import { useTienda } from '../context/Tienda'
import { precio } from '../lib/formato'
import Imagen from './Imagen'

export default function TarjetaProducto({ producto }) {
  const { agregarAlPedido } = useTienda()
  const agotado = producto.estado === 'agotado'
  return (
    <article className={`tarjeta ${agotado ? 'agotado' : ''}`}>
      <Link to={`/p/${producto.codigo}`} className="tarjeta-imagen">
        <Imagen src={producto.imagen_url} alt={producto.nombre} />
        <span className="codigo">{producto.codigo}</span>
        {agotado && <span className="sello">Agotado</span>}
      </Link>
      <div className="tarjeta-cuerpo">
        <p className="tarjeta-categoria">
          {producto.categoria?.emoji} {producto.categoria?.nombre}
        </p>
        <h3>
          <Link to={`/p/${producto.codigo}`}>{producto.nombre}</Link>
        </h3>
        {producto.medida && <p className="tarjeta-medida">{producto.medida}</p>}
        <div className="tarjeta-pie">
          <span className="precio">{precio(producto.precio)}</span>
          <button
            className="btn btn-mini"
            disabled={agotado}
            onClick={() => agregarAlPedido(producto)}
            aria-label={`Agregar ${producto.nombre} a mi pedido`}
          >
            + Agregar
          </button>
        </div>
      </div>
    </article>
  )
}
