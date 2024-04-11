import { CELLS } from '$lib/constants'
import { PAINT_EVENT, paintEmitter } from '$lib/server/PaintEvents'
import type { RequestHandler } from '@sveltejs/kit'

export const GET = (async () => {
  let callback: (jobStatus: [number, number, string]) => void

  const readable = new ReadableStream({
    start(ctr) {
      callback = (update) => {
        ctr.enqueue(`data: ${JSON.stringify(update)}\n\n`)
      }
      paintEmitter.on(PAINT_EVENT, callback)
    },
    cancel() {
      console.log(`Canceled`, new Date())
      paintEmitter.removeListener(PAINT_EVENT, callback)
    },
  })

  return new Response(readable, {
    headers: {
      'content-type': 'text/event-stream',
    },
  })
}) satisfies RequestHandler
