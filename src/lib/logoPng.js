import { NEGOCIO } from './config'
import { COLORES } from './colores'

// Dibuja la insignia del logo en un PNG cuadrado (ideal para la foto de perfil de WhatsApp)
// y lo descarga. El texto se dibuja con la fuente de la página para que se vea igual.
export async function descargarLogoPng(urlLogo, tamano = 1080) {
  await Promise.all([
    document.fonts.load(`800 ${tamano / 10}px "Baloo 2"`),
    document.fonts.load(`800 ${tamano / 16}px "Baloo 2"`),
  ])
  const imagen = await new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('No se pudo cargar el logo.'))
    img.src = urlLogo
  })

  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = tamano
  const ctx = canvas.getContext('2d')
  const c = tamano / 2
  const u = tamano / 100 // 1% del tamaño

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, tamano, tamano)
  ctx.fillStyle = COLORES.rosaClaro
  ctx.beginPath()
  ctx.arc(c, c, 48 * u, 0, Math.PI * 2)
  ctx.fill()
  ctx.lineWidth = 2.4 * u
  ctx.strokeStyle = COLORES.rosa
  ctx.stroke()
  ctx.setLineDash([2 * u, 2 * u])
  ctx.lineWidth = 0.8 * u
  ctx.strokeStyle = COLORES.amarillo
  ctx.beginPath()
  ctx.arc(c, c, 44.5 * u, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  // Escena (proporción del SVG: 214 x 238)
  const alto = 56 * u
  const ancho = (alto * 214) / 238
  ctx.drawImage(imagen, c - ancho / 2, 9 * u, ancho, alto)

  ctx.textAlign = 'center'
  ctx.fillStyle = COLORES.rosa
  ctx.font = `800 ${8.6 * u}px "Baloo 2", system-ui, sans-serif`
  ctx.fillText(NEGOCIO.frase, c, 76 * u)
  ctx.fillStyle = COLORES.morado
  ctx.font = `800 ${6.2 * u}px "Baloo 2", system-ui, sans-serif`
  ctx.fillText(NEGOCIO.fraseSecundaria, c, 85 * u)

  const enlace = document.createElement('a')
  enlace.download = 'logo-dale-dale.png'
  enlace.href = canvas.toDataURL('image/png')
  enlace.click()
}
