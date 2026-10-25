import { useTienda } from '../context/Tienda'

export default function Notificacion() {
  const { aviso } = useTienda()
  if (!aviso) return null
  return (
    <div key={aviso.id} className={`notificacion ${aviso.tipo}`} role="status">
      {aviso.texto}
    </div>
  )
}
