import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as api from '../lib/api'

const TiendaContext = createContext(null)
const CLAVE_PEDIDO = 'daledale-pedido'

function leerPedido() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_PEDIDO)) || []
  } catch {
    return []
  }
}

export function TiendaProvider({ children }) {
  const [catalogo, setCatalogo] = useState({ secciones: [], categorias: [], productos: [] })
  const [ajustes, setAjustes] = useState({ whatsapp: '', horario: '', ubicacion: '', aviso: '', personalizada_activa: true })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [usuario, setUsuario] = useState(null)
  const [pedido, setPedido] = useState(leerPedido)
  const [aviso, setAviso] = useState(null)

  const recargar = useCallback(async () => {
    try {
      const [cat, aj] = await Promise.all([api.obtenerCatalogo(), api.obtenerAjustes()])
      setCatalogo(cat)
      setAjustes(aj)
      setError('')
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }, [])

  const refrescarUsuario = useCallback(async () => {
    setUsuario(await api.obtenerUsuario())
  }, [])

  useEffect(() => {
    recargar()
    refrescarUsuario()
    return api.escucharSesion(refrescarUsuario)
  }, [recargar, refrescarUsuario])

  useEffect(() => {
    try { localStorage.setItem(CLAVE_PEDIDO, JSON.stringify(pedido)) } catch { /* nada */ }
  }, [pedido])

  const notificar = useCallback((texto, tipo = 'ok') => {
    const id = Date.now()
    setAviso({ id, texto, tipo })
    setTimeout(() => setAviso((a) => (a?.id === id ? null : a)), 3200)
  }, [])

  const valor = useMemo(() => {
    // Productos enriquecidos con su categoría y sección; "publicos" = lo que ve el cliente.
    const secciones = [...catalogo.secciones].sort((a, b) => a.orden - b.orden)
    const seccionPorId = Object.fromEntries(secciones.map((x) => [x.id, x]))
    const seccionesActivas = secciones.filter((x) => x.activa)
    const categoriasConSeccion = catalogo.categorias.map((c) => ({ ...c, seccionInfo: seccionPorId[c.seccion] }))
    const porId = Object.fromEntries(categoriasConSeccion.map((c) => [c.id, c]))
    const productos = catalogo.productos.map((p) => ({ ...p, categoria: porId[p.categoria_id] }))
    const visible = (c) => c?.activa && c.seccionInfo?.activa
    const publicos = productos.filter((p) => visible(p.categoria) && p.estado !== 'oculto')
    const categoriasActivas = categoriasConSeccion.filter(visible).sort((a, b) => a.orden - b.orden)
    const personalizadaVisible = ajustes.personalizada_activa !== false

    const agregarAlPedido = (p, cantidad = 1) => {
      setPedido((actual) => {
        const existe = actual.find((i) => i.codigo === p.codigo)
        if (existe) return actual.map((i) => (i.codigo === p.codigo ? { ...i, cantidad: i.cantidad + cantidad } : i))
        return [...actual, { codigo: p.codigo, nombre: p.nombre, precio: Number(p.precio), imagen_url: p.imagen_url, cantidad }]
      })
      notificar(`Agregaste “${p.nombre}” a tu pedido`)
    }
    const cambiarCantidad = (codigo, cantidad) =>
      setPedido((actual) =>
        cantidad <= 0 ? actual.filter((i) => i.codigo !== codigo) : actual.map((i) => (i.codigo === codigo ? { ...i, cantidad } : i)),
      )

    return {
      cargando,
      error,
      recargar,
      ajustes,
      secciones,
      seccionesActivas,
      seccionPorId,
      personalizadaVisible,
      categorias: categoriasConSeccion,
      categoriasActivas,
      productos,
      publicos,
      usuario,
      refrescarUsuario,
      pedido,
      agregarAlPedido,
      cambiarCantidad,
      vaciarPedido: () => setPedido([]),
      notificar,
      aviso,
    }
  }, [catalogo, ajustes, cargando, error, recargar, usuario, refrescarUsuario, pedido, notificar, aviso])

  return <TiendaContext.Provider value={valor}>{children}</TiendaContext.Provider>
}

export const useTienda = () => useContext(TiendaContext)
