import { Link } from 'react-router-dom'
import { useTienda } from '../context/Tienda'
import { NEGOCIO, PERSONALIZADA, SECCION_PERSONALIZADA } from '../lib/config'
import PinataInteractiva from '../components/PinataInteractiva'
import TarjetaProducto from '../components/TarjetaProducto'
import Cargando from '../components/Cargando'
import Imagen from '../components/Imagen'

export default function Inicio() {
  const { categoriasActivas, publicos, seccionesActivas, personalizadaVisible } = useTienda()
  const destacados = publicos.filter((p) => p.destacado && p.estado === 'disponible').slice(0, 8)

  return (
    <>
      <section className="heroe">
        <div className="contenedor heroe-grid">
          <div>
            <p className="etiqueta">{NEGOCIO.subtitulo}</p>
            <h1>
              Piñatas y dulces
              <br />
              <span>para tu fiesta</span>
            </h1>
            <p className="heroe-texto">{NEGOCIO.lema}</p>
            <div className="acciones">
              {seccionesActivas.slice(0, 2).map((sec, i) => (
                <Link key={sec.id} to={`/${sec.id}`} className={`btn ${i === 0 ? 'btn-primario' : 'btn-claro'}`}>
                  {sec.emoji} {sec.nombre}
                </Link>
              ))}
              {personalizadaVisible && <Link to={PERSONALIZADA.ruta} className="btn btn-claro">✨ Diseña la tuya</Link>}
            </div>
          </div>
          <PinataInteractiva />
        </div>
      </section>

      <Cargando>
        {seccionesActivas.length > 0 && (
          <section id="secciones" className="contenedor seccion">
            <h2>¿Qué estás buscando?</h2>
            <div className="tarjetas-seccion">
              {seccionesActivas.map((sec) => (
                <Link key={sec.id} to={`/${sec.id}`} className="tarjeta-seccion">
                  <Imagen src={sec.imagen_url} alt={sec.nombre} />
                  <span>{sec.emoji} {sec.nombre}</span>
                </Link>
              ))}
              {personalizadaVisible && (
                <Link to={PERSONALIZADA.ruta} className="tarjeta-seccion tarjeta-seccion-especial">
                  <div className="imagen-vacia">✨</div>
                  <span>{PERSONALIZADA.emoji} {PERSONALIZADA.nombre}</span>
                </Link>
              )}
            </div>
          </section>
        )}

        {seccionesActivas.map((sec) => {
          const cats = categoriasActivas.filter((c) => c.seccion === sec.id)
          const conPersonalizada = sec.id === SECCION_PERSONALIZADA && personalizadaVisible
          if (!cats.length && !conPersonalizada) return null
          return (
            <section key={sec.id} className="contenedor seccion">
              <div className="seccion-titulo">
                <h2>{sec.emoji} {sec.nombre}</h2>
                <Link to={`/${sec.id}`}>Ver todo →</Link>
              </div>
              <div className="chips-grandes">
                {conPersonalizada && (
                  <Link to={PERSONALIZADA.ruta} className="chip-grande chip-grande-especial">
                    <span className="chip-emoji">{PERSONALIZADA.emoji}</span>
                    {PERSONALIZADA.nombre}
                    <small>Tú eliges el diseño</small>
                  </Link>
                )}
                {cats.map((c) => (
                  <Link key={c.id} to={`/${sec.id}/${c.slug}`} className="chip-grande">
                    <span className="chip-emoji">{c.emoji}</span>
                    {c.nombre}
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        {destacados.length > 0 && (
          <section className="contenedor seccion">
            <div className="seccion-titulo">
              <h2>⭐ Los favoritos de la fiesta</h2>
            </div>
            <div className="rejilla">
              {destacados.map((p) => <TarjetaProducto key={p.id} producto={p} />)}
            </div>
          </section>
        )}
      </Cargando>

      <section className="contenedor seccion">
        <h2>¿Cómo pedir?</h2>
        <ol className="pasos">
          <li><b>1</b><span>Elige tu piñata o tus dulces y agrégalos a tu pedido.</span></li>
          <li><b>2</b><span>Toca <em>“Pedir por WhatsApp”</em>: el mensaje ya lleva el <strong>código</strong> de cada producto.</span></li>
          <li><b>3</b><span>Te confirmamos disponibilidad, entrega y forma de pago por WhatsApp.</span></li>
        </ol>
      </section>
    </>
  )
}
