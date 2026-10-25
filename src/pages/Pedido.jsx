import { Link } from 'react-router-dom'
import { useTienda } from '../context/Tienda'
import { precio } from '../lib/formato'
import { mensajePedido, urlWhatsApp } from '../lib/whatsapp'
import Imagen from '../components/Imagen'

export default function Pedido() {
  const { pedido: guardado, publicos, cambiarCantidad, vaciarPedido, ajustes } = useTienda()
  // Usa nombre y precio actuales del catálogo por si el administrador los cambió.
  const pedido = guardado.map((i) => {
    const p = publicos.find((x) => x.codigo === i.codigo)
    return p ? { ...i, nombre: p.nombre, precio: Number(p.precio), imagen_url: p.imagen_url } : i
  })
  const total = pedido.reduce((s, i) => s + i.precio * i.cantidad, 0)

  if (!pedido.length) {
    return (
      <div className="contenedor seccion estado-vacio">
        <p className="emoji-grande">🛍️</p>
        <h1>Tu pedido está vacío</h1>
        <p>Agrega piñatas y dulces y envíanos todo en un solo mensaje de WhatsApp.</p>
        <div className="acciones">
          <Link to="/pinatas" className="btn btn-primario">Ver piñatas</Link>
          <Link to="/dulceria" className="btn btn-claro">Ir a la dulcería</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="contenedor seccion pedido">
      <h1 className="titulo-pagina">🛍️ Mi pedido</h1>
      <ul className="pedido-lista">
        {pedido.map((i) => (
          <li key={i.codigo}>
            <Imagen src={i.imagen_url} alt={i.nombre} className="pedido-foto" />
            <div className="pedido-info">
              <Link to={`/p/${i.codigo}`}><b>{i.nombre}</b></Link>
              <span className="codigo codigo-linea">{i.codigo}</span>
              <span>{precio(i.precio)} c/u</span>
            </div>
            <div className="contador">
              <button onClick={() => cambiarCantidad(i.codigo, i.cantidad - 1)} aria-label="Quitar uno">−</button>
              <span aria-live="polite">{i.cantidad}</span>
              <button onClick={() => cambiarCantidad(i.codigo, i.cantidad + 1)} aria-label="Agregar uno">+</button>
            </div>
            <b className="pedido-subtotal">{precio(i.precio * i.cantidad)}</b>
          </li>
        ))}
      </ul>
      <div className="pedido-total">
        <span>Total estimado</span>
        <b>{precio(total)}</b>
      </div>
      <p className="texto-suave">El total final (envío, personalización) se confirma por WhatsApp.</p>
      <div className="acciones">
        {ajustes.whatsapp ? (
          <a className="btn btn-whatsapp" href={urlWhatsApp(ajustes.whatsapp, mensajePedido(pedido))} target="_blank" rel="noreferrer">
            💬 Enviar pedido por WhatsApp
          </a>
        ) : (
          <p className="texto-suave">WhatsApp aún no configurado por el administrador.</p>
        )}
        <button className="btn btn-claro" onClick={() => confirm('¿Vaciar tu pedido?') && vaciarPedido()}>
          Vaciar pedido
        </button>
      </div>
    </div>
  )
}
