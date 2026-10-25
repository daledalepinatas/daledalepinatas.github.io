import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTienda } from '../../context/Tienda'
import { guardarProducto, subirImagen } from '../../lib/api'
import { ESTADOS } from '../../lib/config'
import Imagen from '../../components/Imagen'

const VACIO = { nombre: '', categoria_id: '', precio: '', medida: '', descripcion: '', imagen_url: '', estado: 'disponible', destacado: false }

// Espera a que cargue el catálogo para poder rellenar el formulario al editar.
export default function FormularioProducto() {
  const { id } = useParams()
  const { cargando } = useTienda()
  if (cargando) return <p className="estado-vacio">Cargando…</p>
  return <Formulario key={id || 'nuevo'} id={id} />
}

function Formulario({ id }) {
  const navegar = useNavigate()
  const { productos, categorias, secciones, recargar, notificar } = useTienda()
  const existente = productos.find((p) => p.id === id)
  const [form, setForm] = useState(() => (existente ? { ...VACIO, ...existente } : VACIO))
  const [guardando, setGuardando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState('')

  if (id && !existente) {
    return (
      <div className="estado-vacio">
        <p>No encontramos ese producto.</p>
        <Link to="/admin" className="btn btn-primario">Volver</Link>
      </div>
    )
  }

  const cambiar = (campo) => (e) =>
    setForm({ ...form, [campo]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const elegirFoto = async (e) => {
    const archivo = e.target.files?.[0]
    if (!archivo) return
    setSubiendo(true)
    setError('')
    try {
      const url = await subirImagen(archivo)
      setForm((f) => ({ ...f, imagen_url: url }))
    } catch (err) {
      setError(err.message)
    } finally {
      setSubiendo(false)
      e.target.value = ''
    }
  }

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    if (Number(form.precio) < 0) return setError('El precio no puede ser negativo.')
    setGuardando(true)
    try {
      await guardarProducto(form)
      await recargar()
      notificar(existente ? 'Cambios guardados ✅' : 'Producto creado ✅')
      navegar('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form className="tarjeta-form formulario-producto" onSubmit={enviar}>
      <h2>{existente ? `✏️ Editar ${existente.codigo}` : '➕ Nuevo producto'}</h2>
      {!existente && <p className="texto-suave">El código (ej. PIN-0000) se asigna solo al guardar, con las 3 letras de la sección, y no cambia nunca.</p>}

      <div className="form-columnas">
        <div>
          <label>
            Nombre *
            <input required maxLength={120} value={form.nombre} onChange={cambiar('nombre')} placeholder="Ej. Piñata Estrella 7 picos" />
          </label>
          <label>
            Categoría *
            <select required value={form.categoria_id} onChange={cambiar('categoria_id')}>
              <option value="">Elige una categoría…</option>
              {secciones.map((s) => (
                <optgroup key={s.id} label={`${s.emoji} ${s.nombre}${s.activa ? '' : ' (oculta)'}`}>
                  {categorias
                    .filter((c) => c.seccion === s.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.emoji} {c.nombre}{!c.activa ? ' (desactivada)' : ''}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>
          <div className="form-fila">
            <label>
              Precio (MXN) *
              <input required type="number" min="0" step="0.5" inputMode="decimal" value={form.precio} onChange={cambiar('precio')} />
            </label>
            <label>
              Estado
              <select value={form.estado} onChange={cambiar('estado')}>
                {Object.entries(ESTADOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
          </div>
          <label>
            Tamaño / presentación
            <input maxLength={80} value={form.medida} onChange={cambiar('medida')} placeholder="Ej. 80 cm · Bolsa de 1 kg" />
          </label>
          <label>
            Descripción
            <textarea rows={4} maxLength={600} value={form.descripcion} onChange={cambiar('descripcion')} />
          </label>
          <label className="check">
            <input type="checkbox" checked={form.destacado} onChange={cambiar('destacado')} />
            ⭐ Mostrar en “Los favoritos de la fiesta” (inicio)
          </label>
        </div>

        <div className="form-foto">
          <span className="etiqueta-campo">Foto</span>
          <div className="vista-foto">
            <Imagen src={form.imagen_url} alt="Vista previa" />
          </div>
          <label className="btn btn-claro subir">
            {subiendo ? 'Subiendo…' : '📷 Subir foto desde el teléfono o PC'}
            <input type="file" accept="image/*" onChange={elegirFoto} disabled={subiendo} hidden />
          </label>
          <label>
            …o pega la dirección (URL) de una imagen
            <input type="url" value={form.imagen_url.startsWith('data:') ? '' : form.imagen_url} onChange={cambiar('imagen_url')} placeholder="https://…" />
          </label>
          {form.imagen_url && (
            <button type="button" className="btn btn-mini btn-claro" onClick={() => setForm({ ...form, imagen_url: '' })}>
              Quitar foto
            </button>
          )}
        </div>
      </div>

      {error && <p className="error" role="alert">{error}</p>}
      <div className="acciones">
        <button className="btn btn-primario" disabled={guardando || subiendo}>
          {guardando ? 'Guardando…' : '💾 Guardar'}
        </button>
        <Link to="/admin" className="btn btn-claro">Cancelar</Link>
      </div>
    </form>
  )
}
