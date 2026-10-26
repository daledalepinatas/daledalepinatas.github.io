import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTienda } from '../context/Tienda'
import { precio } from '../lib/formato'
import { abrirWhatsApp, enlaceProducto, mensajeProducto, urlWhatsApp } from '../lib/whatsapp'
import { crearPedido } from '../lib/api'
import Imagen from '../components/Imagen'
import Cargando from '../components/Cargando'
import TarjetaProducto from '../components/TarjetaProducto'

export default function Producto() {
  const { codigo } = useParams()
  const { publicos, ajustes, agregarAlPedido, notificar } = useTienda()
  const p = publicos.find((x) => x.codigo.toLowerCase() === codigo.toLowerCase())
  const [folio, setFolio] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Registra el pedido (folio PED-…) y abre WhatsApp con el mensaje.
  const pedir = async () => {
    setEnviando(true)
    try {
      await abrirWhatsApp(async () => {
        const nuevo = await crearPedido('producto', [{ codigo: p.codigo, cantidad: 1 }])
        setFolio(nuevo)
        return urlWhatsApp(ajustes.whatsapp, mensajeProducto(p, nuevo))
      })
    } catch (e) {
      notificar(e.message, 'error')
    } finally {
      setEnviando(false)
    }
  }

  const compartir = async () => {
    const url = enlaceProducto(p.codigo)
    try {
      if (navigator.share) {
        await navigator.share({ title: p.nombre, text: `${p.nombre} (${p.codigo})`, url })
      } else {
        await navigator.clipboard.writeText(url)
        notificar('Enlace copiado 📋')
      }
    } catch { /* el usuario canceló */ }
  }

  return (
    <div className="contenedor seccion">
      <Cargando>
        {!p ? (
          <div className="estado-vacio">
            <p>😕 No encontramos el producto <b>{codigo}</b>.</p>
            <Link to="/" className="btn btn-primario">Ver catálogo</Link>
          </div>
        ) : (
          <>
            <nav className="migas">
              <Link to={`/${p.categoria.seccion}`}>{p.categoria.seccionInfo.nombre}</Link>
              {' / '}
              <Link to={`/${p.categoria.seccion}/${p.categoria.slug}`}>{p.categoria.nombre}</Link>
            </nav>
            <div className="detalle">
              <div className="detalle-imagen">
                <Imagen src={p.imagen_url} alt={p.nombre} />
              </div>
              <div className="detalle-info">
                <span className="codigo codigo-grande">Código: {p.codigo}</span>
                <h1>{p.nombre}</h1>
                <p className="precio precio-grande">{precio(p.precio)}</p>
                {p.estado === 'agotado' ? (
                  <p className="estado estado-agotado">Agotado por ahora — pregúntanos cuándo vuelve</p>
                ) : (
                  <p className="estado estado-ok">Disponible</p>
                )}
                {p.medida && <p><b>Tamaño / presentación:</b> {p.medida}</p>}
                {p.descripcion && <p className="detalle-descripcion">{p.descripcion}</p>}

                <div className="acciones acciones-columna">
                  {!ajustes.whatsapp ? (
                    <p className="texto-suave">WhatsApp aún no configurado por el administrador.</p>
                  ) : p.estado === 'agotado' ? (
                    <a className="btn btn-whatsapp" href={urlWhatsApp(ajustes.whatsapp, mensajeProducto(p))} target="_blank" rel="noreferrer">
                      💬 Preguntar por WhatsApp
                    </a>
                  ) : (
                    <button className="btn btn-whatsapp" onClick={pedir} disabled={enviando}>
                      💬 {enviando ? 'Abriendo WhatsApp…' : 'Pedir por WhatsApp'}
                    </button>
                  )}
                  {folio && (
                    <p className="aviso-folio">
                      🧾 Tu folio es <b>{folio}</b>. <Link to={`/seguimiento/${folio}`}>Consulta cómo va tu pedido</Link>.
                    </p>
                  )}
                  <button className="btn btn-primario" disabled={p.estado === 'agotado'} onClick={() => agregarAlPedido(p)}>
                    🛒 Agregar al carrito
                  </button>
                  <button className="btn btn-claro" onClick={compartir}>🔗 Compartir enlace</button>
                </div>
                <p className="texto-suave nota-codigo">
                  Al escribirnos, el mensaje incluye el código <b>{p.codigo}</b> para saber exactamente qué producto quieres.
                </p>
              </div>
            </div>
            <Relacionados actual={p} />
          </>
        )}
      </Cargando>
    </div>
  )
}

function Relacionados({ actual }) {
  const { publicos } = useTienda()
  const otros = publicos
    .filter((x) => x.categoria_id === actual.categoria_id && x.id !== actual.id)
    .slice(0, 4)
  if (!otros.length) return null
  return (
    <section className="seccion">
      <h2>También te puede gustar</h2>
      <div className="rejilla">
        {otros.map((x) => <TarjetaProducto key={x.id} producto={x} />)}
      </div>
    </section>
  )
}
