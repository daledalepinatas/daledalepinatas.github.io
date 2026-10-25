import { Link } from 'react-router-dom'

export default function NoEncontrado() {
  return (
    <div className="contenedor seccion estado-vacio">
      <p className="emoji-grande">🙈</p>
      <h1>¡Fallaste el golpe!</h1>
      <p>Esta página no existe.</p>
      <Link to="/" className="btn btn-primario">Volver al inicio</Link>
    </div>
  )
}
