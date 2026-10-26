import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTienda } from '../context/Tienda'
import { crearPedido } from '../lib/api'
import { precio } from '../lib/formato'
import { abrirWhatsApp, mensajePedido, urlWhatsApp } from '../lib/whatsapp'
import Imagen from '../components/Imagen'

// Carrito del cliente: junta productos y los envía en un solo mensaje con folio PED-….
export default function Pedido() {
  const { pedido: guardado, publicos, cambiarCantidad, vaciarPedido, ajustes, notificar } = useTienda()
  const [enviado, setEnviado] = useState(null) // { folio, url }
  const [enviando, setEnviando] = useState(false)
  // Usa nombre y precio actuales del catálogo por si el administrador los cambió.
  const pedido = guardado.map((i) => {
    const p = publicos.find((x) => x.codigo === i.codigo)
    return p ? { ...i, nombre: p.nombre, precio: Number(p.precio), imagen_url: p.imagen_url } : i
  })
  const total = pedido.reduce((s, i) => s + i.precio * i.cantidad, 0)

  const enviar = async () => {
    setEnviando(true)
    try {
      let folio = ''
      const url = await abrirWhatsApp(async () => {
        folio = await crearPedido('carrito', pedido)
        return urlWhatsApp(ajustes.whatsapp, mensajePedido(pedido, folio))
      })
      setEnviado({ folio, url })
      vaciarPedido()
      window.scrollTo(0, 0)
    } catch (e) {
      notificar(e.message, 'error')
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <div className="contenedor seccion">
        <div className="tarjeta-form personalizada-lista">
          <p className="emoji-grande">🎉</p>
          <h1>¡Pedido registrado!</h1>
          <p>Tu folio es</p>
          <p className="folio">{enviado.folio}</p>
          <p className="paso-final">
            👉 <b>Último paso:</b> envía el mensaje que se abrió en WhatsApp. Si no se abrió, toca aquí:
          </p>
          <a className="btn btn-whatsapp btn-grande" href={enviado.url} target="_blank" rel="noreferrer">
            💬 Enviar por WhatsApp
          </a>
          <div className="acciones">
            <Link to={`/seguimiento/${enviado.folio}`} className="btn btn-claro">📦 Consultar mi pedido</Link>
            <Link to="/" className="btn btn-claro">Seguir comprando</Link>
          </div>
        </div>
      </div>
    )
  }

  if (!pedido.length) {
    return (
      <div className="contenedor seccion estado-vacio">
        <p className="emoji-grande">🛒</p>
        <h1>Tu carrito está vacío</h1>
        <p>Agrega piñatas y dulces y envíanos todo en un solo mensaje de WhatsApp.</p>
        <div className="acciones">
          <Link to="/" className="btn btn-primario">Ver catálogo</Link>
          <Link to="/seguimiento" className="btn btn-claro">📦 Consultar un pedido</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="contenedor seccion pedido">
      <h1 className="titulo-pagina">🛒 Mi carrito</h1>
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
          <button className="btn btn-whatsapp" onClick={enviar} disabled={enviando}>
            💬 {enviando ? 'Abriendo WhatsApp…' : 'Enviar pedido por WhatsApp'}
          </button>
        ) : (
          <p className="texto-suave">WhatsApp aún no configurado por el administrador.</p>
        )}
        <button className="btn btn-claro" onClick={() => confirm('¿Vaciar tu carrito?') && vaciarPedido()}>
          Vaciar carrito
        </button>
      </div>
    </div>
  )
}
