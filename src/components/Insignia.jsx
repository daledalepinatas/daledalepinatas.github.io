import { NEGOCIO } from '../lib/config'

export const URL_LOGO = `${import.meta.env.BASE_URL}logo.svg`

// Logo en versión insignia: el niño y la piñata dentro de un círculo, con la frase debajo.
export default function Insignia({ tamano = 180, conFrase = true }) {
  return (
    <div className="insignia" style={{ '--tamano': `${tamano}px` }}>
      <div className="insignia-circulo">
        <img src={URL_LOGO} alt="Niño con los ojos vendados golpeando una piñata" />
      </div>
      {conFrase && (
        <p className="insignia-frase">
          <strong>{NEGOCIO.frase}</strong>
          <span>{NEGOCIO.fraseSecundaria}</span>
        </p>
      )}
    </div>
  )
}
