import { Link } from 'react-router-dom'
import { useTienda } from '../context/Tienda'
import { NEGOCIO, PERSONALIZADA, SECCIONES } from '../lib/config'
import PinataInteractiva from '../components/PinataInteractiva'
import TarjetaProducto from '../components/TarjetaProducto'
import Cargando from '../components/Cargando'

export default function Inicio() {
  const { categoriasActivas, publicos } = useTienda()
  const destacados = publicos.filter((p) => p.destacado && p.estado === 'disponible').slice(0, 8)

  return (
    <>
      <section className="heroe">
        <div className="contenedor heroe-grid">
          <div>
            <p className="etiqueta">{NEGOCIO.subtitulo}</p>
            <h1>
              ¡Dale, dale, dale!
              <br />
              <span>no pierdas el tino</span>
            </h1>
            <p className="heroe-texto">{NEGOCIO.lema}</p>
            <div className="acciones">
              <Link to="/pinatas" className="btn btn-primario">🪅 Ver piñatas</Link>
              <Link to={PERSONALIZADA.ruta} className="btn btn-claro">✨ Diseña la tuya</Link>
              <Link to="/dulceria" className="btn btn-claro">🍬 Ir a la dulcería</Link>
            </div>
          </div>
          <PinataInteractiva />
        </div>
      </section>

      <Cargando>
        {Object.values(SECCIONES).map((sec) => {
          const cats = categoriasActivas.filter((c) => c.seccion === sec.id)
          if (!cats.length) return null
          return (
            <section key={sec.id} className="contenedor seccion">
              <div className="seccion-titulo">
                <h2>{sec.emoji} {sec.id === 'pinatas' ? 'Encuentra tu piñata' : 'Dulcería para rellenar'}</h2>
                <Link to={sec.ruta}>Ver todo →</Link>
              </div>
              <div className="chips-grandes">
                {sec.id === 'pinatas' && (
                  <Link to={PERSONALIZADA.ruta} className="chip-grande chip-grande-especial">
                    <span className="chip-emoji">{PERSONALIZADA.emoji}</span>
                    {PERSONALIZADA.nombre}
                    <small>Tú eliges el diseño</small>
                  </Link>
                )}
                {cats.map((c) => (
                  <Link key={c.id} to={`${sec.ruta}/${c.slug}`} className="chip-grande">
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
