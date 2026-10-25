import { useState } from 'react'
import { Link } from 'react-router-dom'
import LluviaDulces from './LluviaDulces'

const GOLPES_PARA_ROMPER = 5
const COLORES = ['#ffc400', '#00b3a4', '#6c2bd9', '#ff7a00', '#00a2ff', '#ff4f9a', '#7ed321']

// Estrella de 7 picos dibujada en SVG.
function Estrella({ golpes }) {
  const picos = COLORES.map((color, i) => {
    const a = (i / COLORES.length) * Math.PI * 2 - Math.PI / 2 + Math.PI / COLORES.length
    const base = 0.5
    const x = (r, d = 0) => (Math.cos(a + d) * r).toFixed(1)
    const y = (r, d = 0) => (Math.sin(a + d) * r).toFixed(1)
    return (
      <g key={color}>
        <polygon points={`${x(42, -base)},${y(42, -base)} ${x(42, base)},${y(42, base)} ${x(118)},${y(118)}`} fill={color} />
        <g className="flecos" style={{ transformOrigin: `${x(118)}px ${y(118)}px` }}>
          <rect x={x(118) - 3} y={y(118)} width="2" height="22" fill={color} />
          <rect x={x(118)} y={y(118)} width="2" height="28" fill="#e6007e" />
          <rect x={+x(118) + 3} y={y(118)} width="2" height="18" fill="#fff" />
        </g>
      </g>
    )
  })
  return (
    <svg viewBox="-140 -140 280 290" className="estrella-svg" aria-hidden="true">
      <line x1="0" y1="-140" x2="0" y2="-45" stroke="#7a5230" strokeWidth="3" />
      {picos}
      <circle r="46" fill="#e6007e" />
      <circle r="46" fill="url(#brillo)" />
      {golpes > 1 && <path d="M-20 -10 L-5 2 L-15 15" stroke="#3b0a26" strokeWidth="3" fill="none" />}
      {golpes > 3 && <path d="M18 -18 L6 -4 L20 8 L10 22" stroke="#3b0a26" strokeWidth="3" fill="none" />}
      <defs>
        <radialGradient id="brillo" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity=".45" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}

export default function PinataInteractiva() {
  const [golpes, setGolpes] = useState(0)
  const [animando, setAnimando] = useState(false)
  const rota = golpes >= GOLPES_PARA_ROMPER

  const golpear = () => {
    if (rota) return
    setGolpes((g) => g + 1)
    setAnimando(false)
    requestAnimationFrame(() => setAnimando(true))
  }

  return (
    <div className="pinata-juego">
      {rota ? (
        <div className="pinata-rota">
          <LluviaDulces />
          <p className="pinata-rota-titulo">¡Le diste! 🎉</p>
          <p>Ahora elige la tuya y llénala de dulces.</p>
          <div className="acciones">
            <Link to="/pinatas" className="btn btn-primario">Ver piñatas</Link>
            <button className="btn btn-claro" onClick={() => setGolpes(0)}>Colgar otra 🪅</button>
          </div>
        </div>
      ) : (
        <>
          <button
            className={`pinata-boton ${animando ? 'golpe' : ''}`}
            onClick={golpear}
            onAnimationEnd={() => setAnimando(false)}
            aria-label={`Golpear la piñata. Llevas ${golpes} de ${GOLPES_PARA_ROMPER} golpes`}
          >
            <Estrella golpes={golpes} />
          </button>
          <p className="pinata-instruccion">
            {golpes === 0 ? '👆 ¡Dale un golpe!' : `¡Dale, dale, dale! ${golpes}/${GOLPES_PARA_ROMPER}`}
          </p>
        </>
      )}
    </div>
  )
}
