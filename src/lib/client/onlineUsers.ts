import type { getOnlineUsers } from '$lib/server/db/db'

export async function fetchOnlineUsers() {
  const result = await fetch('/api/onlineUsers')

  return result.json()
}
