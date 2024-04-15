import { getOnlineUsers, saveHeartbeat } from '$lib/server/db/db'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET = (async ({ request }) => {
  const onlineUsers = await getOnlineUsers()

  return json(onlineUsers)
}) satisfies RequestHandler
