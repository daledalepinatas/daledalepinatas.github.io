import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Encabezado from './components/Encabezado'
import PiePagina from './components/PiePagina'
import Notificacion from './components/Notificacion'
import BotonPedido from './components/BotonPedido'
import Inicio from './pages/Inicio'
import Catalogo from './pages/Catalogo'
import Producto from './pages/Producto'
import Pedido from './pages/Pedido'
import Personalizada from './pages/Personalizada'
import NoEncontrado from './pages/NoEncontrado'
import Admin from './pages/admin/Admin'

export default function App() {
  const { pathname } = useLocation()
  const enAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Encabezado />
      <main className="principal">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/p/:codigo" element={<Producto />} />
          <Route path="/personalizada" element={<Personalizada />} />
          <Route path="/pedido" element={<Pedido />} />
          <Route path="/admin/*" element={<Admin />} />
          {/* Secciones creadas desde el panel: /pinatas, /dulceria, /globos… */}
          <Route path="/:seccion" element={<Catalogo />} />
          <Route path="/:seccion/:slug" element={<Catalogo />} />
          <Route path="*" element={<NoEncontrado />} />
        </Routes>
      </main>
      {!enAdmin && <BotonPedido />}
      <PiePagina />
      <Notificacion />
    </>
  )
}
