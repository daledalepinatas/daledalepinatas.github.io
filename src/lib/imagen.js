// Prepara la foto antes de subirla: la reduce (JPEG) para ahorrar espacio y datos y, si se pide,
// la deja cuadrada SIN recortar el producto: la foto completa queda centrada sobre un fondo
// suave del color promedio de la propia foto. Así todas las tarjetas del catálogo se ven parejas.
export function redimensionarImagen(archivo, { cuadrada = true, lado = 1080, calidad = 0.85 } = {}) {
  return new Promise((resolve, reject) => {
    if (!archivo.type.startsWith('image/')) {
      reject(new Error('El archivo no es una imagen.'))
      return
    }
    const img = new Image()
    const url = URL.createObjectURL(archivo)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const escala = Math.min(1, lado / Math.max(img.width, img.height))
      const ancho = Math.round(img.width * escala)
      const alto = Math.round(img.height * escala)
      if (cuadrada) {
        canvas.width = canvas.height = Math.max(ancho, alto)
        ctx.fillStyle = colorDeFondo(img)
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, (canvas.width - ancho) / 2, (canvas.height - alto) / 2, ancho, alto)
      } else {
        canvas.width = ancho
        canvas.height = alto
        ctx.drawImage(img, 0, 0, ancho, alto)
      }
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('No se pudo procesar la imagen.'))),
        'image/jpeg',
        calidad,
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen.'))
    }
    img.src = url
  })
}

// Color promedio de la foto, aclarado, para rellenar los lados sin que se note un corte.
function colorDeFondo(img) {
  const c = document.createElement('canvas')
  c.width = c.height = 1
  const ctx = c.getContext('2d')
  ctx.drawImage(img, 0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  const aclarar = (v) => Math.round(v + (255 - v) * 0.75)
  return `rgb(${aclarar(r)}, ${aclarar(g)}, ${aclarar(b)})`
}

export function blobADataUrl(blob) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader()
    lector.onload = () => resolve(lector.result)
    lector.onerror = reject
    lector.readAsDataURL(blob)
  })
}
