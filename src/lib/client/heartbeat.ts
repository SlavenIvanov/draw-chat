export async function sendHeartbeat(userName: string) {
  return fetch('/api/heartbeat', {
    method: 'POST',
    body: JSON.stringify({ userName }),
  })
}
