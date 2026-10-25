import { useMemo } from 'react'

const DULCES = ['🍬', '🍭', '🍫', '🎊', '🍬', '⭐', '🍡', '🎉']

export default function LluviaDulces({ cantidad = 36 }) {
  const piezas = useMemo(
    () =>
      Array.from({ length: cantidad }, (_, i) => ({
        id: i,
        emoji: DULCES[i % DULCES.length],
        izquierda: Math.random() * 100,
        retraso: Math.random() * 0.8,
        duracion: 1.8 + Math.random() * 1.4,
        giro: Math.round(Math.random() * 720 - 360),
      })),
    [cantidad],
  )
  return (
    <div className="lluvia" aria-hidden="true">
      {piezas.map((p) => (
        <span
          key={p.id}
          style={{
            left: `${p.izquierda}%`,
            animationDelay: `${p.retraso}s`,
            animationDuration: `${p.duracion}s`,
            '--giro': `${p.giro}deg`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  )
}
