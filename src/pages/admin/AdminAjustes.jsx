import { useState } from 'react'
import { useTienda } from '../../context/Tienda'
import { guardarAjustes } from '../../lib/api'
import { NEGOCIO } from '../../lib/config'
import { normalizarNumero, urlWhatsApp } from '../../lib/whatsapp'
import { descargarLogoPng } from '../../lib/logoPng'
import Insignia, { URL_LOGO } from '../../components/Insignia'

export default function AdminAjustes() {
  const { cargando } = useTienda()
  if (cargando) return <p className="estado-vacio">Cargando…</p>
  return <Formulario />
}

function Formulario() {
  const { ajustes, recargar, notificar } = useTienda()
  const [form, setForm] = useState(ajustes)
  const [guardando, setGuardando] = useState(false)
  const numero = normalizarNumero(form.whatsapp)
  const numeroValido = /^\d{11,15}$/.test(numero)

  const enviar = async (e) => {
    e.preventDefault()
    if (form.whatsapp && !numeroValido) {
      notificar('El número de WhatsApp no parece válido (10 dígitos).', 'error')
      return
    }
    setGuardando(true)
    try {
      await guardarAjustes(form)
      await recargar()
      notificar('Ajustes guardados ✅')
    } catch (err) {
      notificar(err.message, 'error')
    } finally {
      setGuardando(false)
    }
  }

  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  return (
    <form className="tarjeta-form" onSubmit={enviar}>
      <h2>💬 WhatsApp y datos del negocio</h2>
      <label>
        Número de WhatsApp que recibe los pedidos
        <input type="tel" inputMode="tel" value={form.whatsapp} onChange={cambiar('whatsapp')} placeholder="10 dígitos, ej. 6610000000" />
      </label>
      {form.whatsapp && (
        <p className={numeroValido ? 'texto-suave' : 'error'}>
          {numeroValido ? `Los clientes escribirán a +${numero}. ` : 'Escribe los 10 dígitos de tu número. '}
          {numeroValido && (
            <a href={urlWhatsApp(form.whatsapp, `Prueba de ${NEGOCIO.nombre}: este número recibe los pedidos.`)} target="_blank" rel="noreferrer">
              Probar enlace
            </a>
          )}
        </p>
      )}
      <label>
        Horario
        <input maxLength={120} value={form.horario} onChange={cambiar('horario')} />
      </label>
      <label>
        Zona de entrega / ubicación
        <input maxLength={160} value={form.ubicacion} onChange={cambiar('ubicacion')} />
      </label>
      <label>
        Aviso en la parte superior de la tienda (déjalo vacío para no mostrar nada)
        <input maxLength={160} value={form.aviso} onChange={cambiar('aviso')} placeholder="Ej. ¡Envío gratis en pedidos mayores a $800!" />
      </label>
      <button className="btn btn-primario" disabled={guardando}>{guardando ? 'Guardando…' : '💾 Guardar ajustes'}</button>

      <hr className="separador" />
      <h2>🖼️ Logo para WhatsApp y redes</h2>
      <div className="logo-descarga">
        <Insignia tamano={140} />
        <div>
          <p className="texto-suave">
            Descarga el logo como imagen cuadrada (1080 × 1080) para usarlo como foto de perfil de WhatsApp Business,
            Facebook o Instagram.
          </p>
          <button
            type="button"
            className="btn"
            onClick={() => descargarLogoPng(URL_LOGO).catch((err) => notificar(err.message, 'error'))}
          >
            ⬇️ Descargar logo (PNG)
          </button>
        </div>
      </div>
    </form>
  )
}
