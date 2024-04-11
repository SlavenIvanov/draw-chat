import { saveHeartbeat } from '$lib/server/db/db'
import type { RequestHandler } from '@sveltejs/kit'

export const POST = (async ({ request }) => {
  const { headers } = request
  const userName = headers.get('userName')

  if (!userName) return new Response()

  console.log({ userName })

  saveHeartbeat(userName)

  return new Response()
}) satisfies RequestHandler
