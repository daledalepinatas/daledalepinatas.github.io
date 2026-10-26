import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTienda } from '../context/Tienda'
import { crearPersonalizada } from '../lib/api'
import { PERSONALIZADA, SECCION_PERSONALIZADA, TAMANOS } from '../lib/config'
import { abrirWhatsApp, mensajePersonalizada, urlWhatsApp } from '../lib/whatsapp'
import ChipsSeccion from '../components/ChipsSeccion'

const VACIO = { diseno: '', tamano: '', fecha_evento: '', detalles: '' }
const hoy = () => new Date().toISOString().slice(0, 10)

export default function Personalizada() {
  const { ajustes, cargando, personalizadaVisible } = useTienda()
  const [form, setForm] = useState(VACIO)
  const [foto, setFoto] = useState(null) // { archivo, url } — solo vista previa, no se sube
  const [enviada, setEnviada] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => () => foto && URL.revokeObjectURL(foto.url), [foto])

  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  const elegirFoto = (e) => {
    const archivo = e.target.files?.[0]
    e.target.value = ''
    if (!archivo) return
    if (!archivo.type.startsWith('image/')) return setError('El archivo debe ser una imagen.')
    setError('')
    setFoto({ archivo, url: URL.createObjectURL(archivo) })
  }

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.tamano) return setError('Elige un tamaño.')
    if (!ajustes.whatsapp) return setError('La tienda aún no tiene WhatsApp configurado. Inténtalo más tarde.')
    setEnviando(true)
    try {
      let solicitud
      await abrirWhatsApp(async () => {
        const { folio, foto_url } = await crearPersonalizada({ ...form, foto: foto?.archivo })
        solicitud = { ...form, folio, foto_url }
        return urlWhatsApp(ajustes.whatsapp, mensajePersonalizada(solicitud, TAMANOS))
      })
      setEnviada(solicitud)
      window.scrollTo(0, 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  if (!cargando && !personalizadaVisible && !enviada) {
    return (
      <div className="contenedor seccion estado-vacio">
        <p className="emoji-grande">✨</p>
        <h1>Por ahora no estamos tomando pedidos personalizados</h1>
        <p>Mira las piñatas que tenemos listas o escríbenos por WhatsApp.</p>
        <Link to="/" className="btn btn-primario">Ver catálogo</Link>
      </div>
    )
  }

  return (
    <div className="contenedor seccion">
      <h1 className="titulo-pagina">{PERSONALIZADA.emoji} Piñata personalizada</h1>
      <ChipsSeccion seccion={SECCION_PERSONALIZADA} />

      {enviada ? (
        <div className="tarjeta-form personalizada-lista">
          <p className="emoji-grande">🎉</p>
          <h2>¡Tu solicitud está lista!</h2>
          <p>Tu folio es</p>
          <p className="folio">{enviada.folio}</p>
          {foto && (
            <p className="foto-enviada">
              <img src={foto.url} alt="Tu foto de referencia" className="foto-referencia" />
              <span>📷 Tu foto ya va incluida en el mensaje.</span>
            </p>
          )}
          <p className="paso-final">
            👉 <b>Último paso:</b> envía el mensaje que se abrió en WhatsApp. Si no se abrió, toca aquí:
          </p>
          <a className="btn btn-whatsapp btn-grande" href={urlWhatsApp(ajustes.whatsapp, mensajePersonalizada(enviada, TAMANOS))} target="_blank" rel="noreferrer">
            💬 Enviar por WhatsApp
          </a>
          <div className="acciones">
            <button className="btn btn-claro" onClick={() => { setEnviada(null); setForm(VACIO); setFoto(null) }}>
              Pedir otra piñata personalizada
            </button>
            <Link to={`/seguimiento/${enviada.folio}`} className="btn btn-claro">📦 Consultar mi pedido</Link>
          </div>
        </div>
      ) : (
        <form className="tarjeta-form formulario-personalizada" onSubmit={enviar}>
          <p className="texto-suave">
            Cuéntanos cómo la imaginas y te mandamos la cotización por WhatsApp. ¡Hacemos casi cualquier diseño!
          </p>

          <label>
            1. ¿Qué diseño buscas? *
            <textarea
              required
              minLength={3}
              maxLength={600}
              rows={3}
              value={form.diseno}
              onChange={cambiar('diseno')}
              placeholder="Ej. Un dinosaurio verde con el nombre “Sofía”, colores pastel…"
            />
          </label>

          <div className="campo">
            <span className="etiqueta-campo">2. Foto de referencia (opcional)</span>
            <div className="foto-elegir">
              {foto ? (
                <img src={foto.url} alt="Vista previa de tu referencia" className="foto-referencia" />
              ) : (
                <div className="foto-vacia" aria-hidden="true">📷</div>
              )}
              <div>
                <label className="btn btn-claro subir">
                  {foto ? 'Cambiar foto' : '📷 Elegir foto'}
                  <input type="file" accept="image/*" onChange={elegirFoto} hidden />
                </label>
                {foto && (
                  <button type="button" className="btn btn-mini btn-claro" onClick={() => setFoto(null)}>Quitar</button>
                )}
                <p className="texto-suave nota">Se enviará junto con tu mensaje de WhatsApp.</p>
              </div>
            </div>
          </div>

          <fieldset className="tamanos">
            <legend className="etiqueta-campo">3. ¿De qué tamaño la quieres? *</legend>
            {Object.entries(TAMANOS).map(([clave, texto]) => (
              <label key={clave} className={`tamano ${form.tamano === clave ? 'elegido' : ''}`}>
                <input type="radio" name="tamano" value={clave} checked={form.tamano === clave} onChange={cambiar('tamano')} />
                <span className={`tamano-icono tamano-${clave}`} aria-hidden="true">🪅</span>
                {texto}
              </label>
            ))}
          </fieldset>

          <label>
            4. ¿Para qué fecha la necesitas? (opcional)
            <input type="date" min={hoy()} value={form.fecha_evento} onChange={cambiar('fecha_evento')} />
          </label>

          <label>
            5. ¿Algún detalle que quieras agregar? (opcional)
            <textarea
              maxLength={600}
              rows={3}
              value={form.detalles}
              onChange={cambiar('detalles')}
              placeholder="Ej. Que traiga dulces, con flecos dorados, nombre en la panza…"
            />
          </label>

          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn-whatsapp" disabled={enviando}>
            {enviando ? (foto ? 'Subiendo tu foto…' : 'Preparando…') : '💬 Pedir cotización por WhatsApp'}
          </button>
        </form>
      )}
    </div>
  )
}
