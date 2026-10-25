import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { TiendaProvider } from './context/Tienda'
import App from './App'
import './styles.css'

// HashRouter (#/ruta) porque GitHub Pages no sabe redirigir rutas de una SPA.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <TiendaProvider>
        <App />
      </TiendaProvider>
    </HashRouter>
  </StrictMode>,
)
