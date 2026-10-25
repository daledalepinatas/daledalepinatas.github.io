import { useState } from 'react'

// Imagen con respaldo: si falla o no hay foto, muestra una piñata dibujada.
export default function Imagen({ src, alt, className = '' }) {
  const [fallo, setFallo] = useState(false)
  if (!src || fallo) {
    return (
      <div className={`imagen-vacia ${className}`} role="img" aria-label={alt}>
        🪅
      </div>
    )
  }
  return <img src={src} alt={alt} loading="lazy" className={className} onError={() => setFallo(true)} />
}
