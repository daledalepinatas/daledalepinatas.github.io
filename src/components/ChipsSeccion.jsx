import { NavLink } from 'react-router-dom'
import { useTienda } from '../context/Tienda'
import { PERSONALIZADA, SECCIONES } from '../lib/config'

// Chips de la sección: "✨ Personalizada" siempre va primero, luego las categorías activas.
export default function ChipsSeccion({ seccion = 'pinatas', actual }) {
  const { categoriasActivas } = useTienda()
  const sec = SECCIONES[seccion]
  const clase = ({ isActive }) => (isActive ? 'chip activo' : 'chip')
  return (
    <nav className="chips" aria-label="Categorías">
      {seccion === 'pinatas' && (
        <NavLink to={PERSONALIZADA.ruta} className={({ isActive }) => `chip chip-especial ${isActive ? 'activo' : ''}`}>
          {PERSONALIZADA.emoji} {PERSONALIZADA.nombre}
        </NavLink>
      )}
      <NavLink to={sec.ruta} end className={() => (actual === null ? 'chip activo' : 'chip')}>Todas</NavLink>
      {categoriasActivas
        .filter((c) => c.seccion === seccion)
        .map((c) => (
          <NavLink key={c.id} to={`${sec.ruta}/${c.slug}`} className={clase}>
            {c.emoji} {c.nombre}
          </NavLink>
        ))}
    </nav>
  )
}
