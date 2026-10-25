import { useState } from 'react'
import { useTienda } from '../../context/Tienda'
import { iniciarSesion, MODO_DEMO } from '../../lib/api'

export default function Login() {
  const { refrescarUsuario, notificar } = useTienda()
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const entrar = async (e) => {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      await iniciarSesion(correo, contrasena)
      await refrescarUsuario()
      notificar('¡Bienvenido al panel! 🎉')
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="contenedor seccion">
      <form className="tarjeta-form login" onSubmit={entrar}>
        <h1>🔐 Acceso administrador</h1>
        {MODO_DEMO ? (
          <p className="aviso-demo">
            Estás en <b>modo demostración</b> (sin base de datos conectada). Puedes entrar sin contraseña para
            practicar; los cambios solo se guardan en este navegador.
          </p>
        ) : (
          <>
            <label>
              Correo
              <input type="email" autoComplete="username" required value={correo} onChange={(e) => setCorreo(e.target.value)} />
            </label>
            <label>
              Contraseña
              <input type="password" autoComplete="current-password" required value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
            </label>
          </>
        )}
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn btn-primario" disabled={enviando}>
          {enviando ? 'Entrando…' : MODO_DEMO ? 'Entrar a la demostración' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
