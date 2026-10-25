import { NavLink } from 'react-router-dom'
import { useTienda } from '../context/Tienda'
import { PERSONALIZADA, SECCION_PERSONALIZADA } from '../lib/config'

// Chips de la sección: "✨ Personalizada" siempre va primero, luego las categorías activas.
export default function ChipsSeccion({ seccion = SECCION_PERSONALIZADA, actual }) {
  const { categoriasActivas, personalizadaVisible } = useTienda()
  const ruta = `/${seccion}`
  const clase = ({ isActive }) => (isActive ? 'chip activo' : 'chip')
  return (
    <nav className="chips" aria-label="Categorías">
      {seccion === SECCION_PERSONALIZADA && personalizadaVisible && (
        <NavLink to={PERSONALIZADA.ruta} className={({ isActive }) => `chip chip-especial ${isActive ? 'activo' : ''}`}>
          {PERSONALIZADA.emoji} {PERSONALIZADA.nombre}
        </NavLink>
      )}
      <NavLink to={ruta} end className={() => (actual === null ? 'chip activo' : 'chip')}>Todas</NavLink>
      {categoriasActivas
        .filter((c) => c.seccion === seccion)
        .map((c) => (
          <NavLink key={c.id} to={`${ruta}/${c.slug}`} className={clase}>
            {c.emoji} {c.nombre}
          </NavLink>
        ))}
    </nav>
  )
}
