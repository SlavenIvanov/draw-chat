import { saveHeartbeat } from '$lib/server/db/db'
import type { RequestHandler } from '@sveltejs/kit'
import { loadConfigFromFile } from 'vite'

export const POST = (async ({ request }) => {
  const data = await request.json()

  if (!data.userName) return new Response()

  saveHeartbeat(data.userName)

  return new Response()
}) satisfies RequestHandler
