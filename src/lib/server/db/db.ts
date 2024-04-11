import { gte } from 'drizzle-orm'
import { dbClient as db } from './dbClient'
import { pixels, users } from './schema'
import { HEARTBEAT_INTERVAL } from '$lib/constants'

export async function getPixels() {
  // await new Promise((res) => setTimeout(res, 2000))
  return db.query.pixels.findMany()
}

export async function setPixel(x: number, y: number, color: string) {
  return db
    .insert(pixels)
    .values({ x, y, color })
    .onConflictDoUpdate({ target: [pixels.x, pixels.y], set: { color } })
}

export async function getOnlineUsers() {
  return db.query.users.findMany({
    where: gte(
      users.lastHeartBeat,
      new Date(new Date().getTime() - HEARTBEAT_INTERVAL).toISOString()
    ),
  })
}

export async function saveHeartbeat(userName: string) {
  return db
    .insert(users)
    .values({ name: userName })
    .onConflictDoUpdate({
      target: users.name,
      set: {
        lastHeartBeat: new Date().toISOString(),
      },
    })
}
