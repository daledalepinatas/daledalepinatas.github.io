import { Link } from 'react-router-dom'
import { useTienda } from '../context/Tienda'
import { NEGOCIO } from '../lib/config'
import { urlWhatsApp } from '../lib/whatsapp'

export default function PiePagina() {
  const { ajustes } = useTienda()
  return (
    <footer className="pie">
      <div className="contenedor pie-grid">
        <div>
          <p className="pie-marca">🪅 {NEGOCIO.nombre}</p>
          <p>{NEGOCIO.lema}</p>
        </div>
        <div>
          {ajustes.horario && <p>🕑 {ajustes.horario}</p>}
          {ajustes.ubicacion && <p>📍 {ajustes.ubicacion}</p>}
          {ajustes.whatsapp && (
            <p>
              <a href={urlWhatsApp(ajustes.whatsapp, `¡Hola, ${NEGOCIO.nombreCorto}! Tengo una pregunta.`)} target="_blank" rel="noreferrer">
                💬 Escríbenos por WhatsApp
              </a>
            </p>
          )}
        </div>
        <div className="pie-links">
          <Link to="/pinatas">Piñatas</Link>
          <Link to="/dulceria">Dulcería</Link>
          <Link to="/admin">Acceso administrador</Link>
        </div>
      </div>
      <p className="pie-legal">Fotos de muestra: Unsplash (licencia gratuita). Precios en pesos mexicanos.</p>
    </footer>
  )
}
