import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { consultarPedido } from '../lib/api'
import { ESTADOS_PEDIDO, TAMANOS } from '../lib/config'
import { precio } from '../lib/formato'

const PASOS_CATALOGO = ['nuevo', 'confirmado', 'preparacion', 'listo', 'entregado']
const PASOS_PERSONALIZADA = ['nuevo', 'cotizado', 'confirmado', 'preparacion', 'listo', 'entregado']

const fechaLarga = (valor, soloDia = false) =>
  new Date(soloDia ? `${valor}T12:00:00` : valor).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })

// "Consultar mi pedido": el cliente escribe su folio (PED-0001 / PER-0001) y ve cómo va.
export default function Seguimiento() {
  const { folio: folioRuta } = useParams()
  const navegar = useNavigate()
  const [folio, setFolio] = useState(folioRuta || '')
  const [resultado, setResultado] = useState(null)
  const [estado, setEstado] = useState('inicio') // inicio | buscando | listo | no-existe | error
  const [error, setError] = useState('')

  useEffect(() => {
    if (!folioRuta) return
    let vigente = true
    setEstado('buscando')
    consultarPedido(folioRuta)
      .then((r) => {
        if (!vigente) return
        setResultado(r)
        setEstado(r ? 'listo' : 'no-existe')
      })
      .catch((e) => {
        if (!vigente) return
        setError(e.message)
        setEstado('error')
      })
    return () => {
      vigente = false
    }
  }, [folioRuta])

  const buscar = (e) => {
    e.preventDefault()
    const limpio = folio.trim().toUpperCase()
    if (limpio) navegar(`/seguimiento/${limpio}`)
  }

  const pasos = resultado?.tipo === 'personalizada' ? PASOS_PERSONALIZADA : PASOS_CATALOGO
  const indiceActual = resultado ? pasos.indexOf(resultado.estado) : -1
  const info = resultado && ESTADOS_PEDIDO[resultado.estado]

  return (
    <div className="contenedor seccion seguimiento">
      <h1 className="titulo-pagina">📦 Consultar mi pedido</h1>
      <form className="tarjeta-form form-linea" onSubmit={buscar}>
        <label>
          Escribe tu folio (viene en tu mensaje de WhatsApp)
          <div className="form-fila">
            <input
              className="crece"
              value={folio}
              onChange={(e) => setFolio(e.target.value)}
              placeholder="PED-0001 o PER-0001"
              autoCapitalize="characters"
              required
            />
            <button className="btn btn-primario">Consultar</button>
          </div>
        </label>
      </form>

      {estado === 'buscando' && <p className="estado-vacio">Buscando tu pedido…</p>}
      {estado === 'no-existe' && (
        <p className="estado-vacio">😕 No encontramos el folio <b>{folioRuta}</b>. Revisa que esté bien escrito.</p>
      )}
      {estado === 'error' && <p className="error estado-vacio">{error}</p>}

      {estado === 'listo' && resultado && (
        <div className="tarjeta-form resultado-seguimiento">
          <div className="seguimiento-cabecera">
            <span className="folio">{resultado.folio}</span>
            <span className="texto-suave">
              {resultado.tipo === 'personalizada' ? '✨ Piñata personalizada' : '🛒 Pedido del catálogo'} · {fechaLarga(resultado.fecha)}
            </span>
          </div>

          <p className={`estado-actual estado-${resultado.estado}`}>
            <span className="estado-emoji">{info?.emoji}</span>
            <span>
              <b>{info?.nombre}</b>
              <small>{info?.cliente}</small>
            </span>
          </p>

          {resultado.estado !== 'cancelado' && (
            <ol className="linea-tiempo">
              {pasos.map((paso, i) => (
                <li key={paso} className={i < indiceActual ? 'hecho' : i === indiceActual ? 'actual' : ''}>
                  <span className="punto">{i < indiceActual ? '✓' : ESTADOS_PEDIDO[paso].emoji}</span>
                  <span>{ESTADOS_PEDIDO[paso].nombre}</span>
                </li>
              ))}
            </ol>
          )}

          {resultado.items && (
            <ul className="seguimiento-items">
              {resultado.items.map((i) => (
                <li key={i.codigo}>
                  <span>{i.cantidad} × {i.nombre} <small className="codigo codigo-linea">{i.codigo}</small></span>
                  <b>{precio(i.precio * i.cantidad)}</b>
                </li>
              ))}
              <li className="seguimiento-total">
                <span>Total estimado</span>
                <b>{precio(resultado.total)}</b>
              </li>
            </ul>
          )}
          {resultado.tipo === 'personalizada' && (
            <p className="texto-suave">
              📏 {TAMANOS[resultado.tamano]}
              {resultado.fecha_evento && <> · 📅 Para el {fechaLarga(resultado.fecha_evento, true)}</>}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
