import { CELLS } from '$lib/constants.js'
import { PAINT_EVENT, paintEmitter } from '$lib/server/PaintEvents'
import { getOnlineUsers, getPixels, setPixel } from '$lib/server/db/db.js'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = () => {
  console.log('LOAD')

  return {
    // TODO fix streaming promises https://kit.svelte.dev/docs/load#streaming-with-promises
    streamed: {
      pixels: getPixels(),
      onlineUsers: getOnlineUsers(),
    },
  }
}

export const actions = {
  paint: async ({ request }) => {
    const data = await request.formData()
    const coords = data.get('coords') as string | null
    const color = data.get('color') as string | null

    if (!coords || !color) return

    const [xString, yString] = coords.split(':')

    const x = parseInt(xString)
    const y = parseInt(yString)

    if (Number.isNaN(x) || Number.isNaN(y)) return
    if (x >= CELLS || y >= CELLS) return
    if (!/^#[0-9A-F]{6}$/i.test(color)) return

    setPixel(x, y, color)
    paintEmitter.emit(PAINT_EVENT, [x, y, color])
    console.log(`✅ Saved ${x}:${y}:${color}`)
  },
  createUser: async ({ request }) => {
    const data = await request.formData()
    const coords = data.get('coords') as string | null
    console.log('userCreated')
  },
}
