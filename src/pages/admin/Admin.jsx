import { NavLink, Route, Routes } from 'react-router-dom'
import { useTienda } from '../../context/Tienda'
import { cerrarSesion, MODO_DEMO, reiniciarDemo } from '../../lib/api'
import Login from './Login'
import AdminProductos from './AdminProductos'
import FormularioProducto from './FormularioProducto'
import AdminCategorias from './AdminCategorias'
import AdminAjustes from './AdminAjustes'
import AdminPersonalizadas from './AdminPersonalizadas'

export default function Admin() {
  const { usuario, refrescarUsuario, recargar, notificar } = useTienda()

  const salir = async () => {
    await cerrarSesion()
    await refrescarUsuario()
    notificar('Sesión cerrada')
  }

  if (!usuario) return <Login />

  if (!usuario.esAdmin) {
    return (
      <div className="contenedor seccion estado-vacio">
        <p>🚫 La cuenta <b>{usuario.correo}</b> no tiene permisos de administrador.</p>
        <button className="btn btn-primario" onClick={salir}>Cerrar sesión</button>
      </div>
    )
  }

  return (
    <div className="contenedor seccion admin">
      <div className="admin-cabecera">
        <div>
          <h1 className="titulo-pagina">⚙️ Panel de administración</h1>
          <p className="texto-suave">Sesión: {usuario.correo}</p>
        </div>
        <div className="acciones">
          {MODO_DEMO && (
            <button
              className="btn btn-claro"
              onClick={async () => {
                if (!confirm('¿Restaurar los datos de prueba? Se perderán tus cambios de demostración.')) return
                reiniciarDemo()
                await recargar()
                notificar('Datos de prueba restaurados')
              }}
            >
              ↺ Restaurar demo
            </button>
          )}
          <button className="btn btn-claro" onClick={salir}>Cerrar sesión</button>
        </div>
      </div>
      <nav className="pestanas">
        <NavLink to="/admin" end>🪅 Productos</NavLink>
        <NavLink to="/admin/personalizadas">✨ Personalizadas</NavLink>
        <NavLink to="/admin/categorias">🗂️ Categorías</NavLink>
        <NavLink to="/admin/ajustes">💬 WhatsApp y ajustes</NavLink>
      </nav>
      <Routes>
        <Route index element={<AdminProductos />} />
        <Route path="nuevo" element={<FormularioProducto />} />
        <Route path="editar/:id" element={<FormularioProducto />} />
        <Route path="personalizadas" element={<AdminPersonalizadas />} />
        <Route path="categorias" element={<AdminCategorias />} />
        <Route path="ajustes" element={<AdminAjustes />} />
      </Routes>
    </div>
  )
}
