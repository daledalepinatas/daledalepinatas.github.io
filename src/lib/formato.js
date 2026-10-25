const moneda = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })

export const precio = (n) => `${moneda.format(Number(n) || 0)} MXN`

export function slugify(texto) {
  return (texto || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function normalizarBusqueda(texto) {
  return (texto || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}
