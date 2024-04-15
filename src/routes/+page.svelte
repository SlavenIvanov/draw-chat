<script lang="ts">
  import { browser } from '$app/environment'
  import { enhance } from '$app/forms'
  import { sendHeartbeat } from '$lib/client/heartbeat'
  import * as Card from '$lib/components/ui/card'
  import {
    CELLS,
    HEARTBEAT_INTERVAL,
    USER_FETCH_INTERVAL,
  } from '$lib/constants'
  import { lacksName, userName } from '$lib/userStore'
  import { onMount } from 'svelte'
  import type { PageData } from './$types'
  import { fetchOnlineUsers } from '$lib/client/onlineUsers'

  export let data: PageData

  function getColor(pixels: any[], x: number, y: number) {
    const [pixel] = pixels.filter((p) => p.x === x && p.y === y)
    return pixel?.color
  }

  const colors = [
    '#718096', // gray-500
    '#E53E3E', // red-500
    '#DD6B20', // orange-500
    '#D69E2E', // yellow-500
    '#38A169', // green-500
    '#3182CE', // blue-500
    '#805AD5', // indigo-500
    '#D53F8C', // purple-500
  ]

  let currentColor = colors[0]

  $: if (browser) {
    const eventSource = new EventSource('/api/updates')
    eventSource.onmessage = function (event) {
      const update: [number, number, string] = JSON.parse(event.data)

      const [x, y, color] = update

      setPixelColor(x, y, color)
    }
    if (!$lacksName) {
      sendHeartbeat($userName)
      setInterval(() => {
        sendHeartbeat($userName)
      }, HEARTBEAT_INTERVAL)
    }
  }

  let onlineUsers: any[] = []
  onMount(() => {
    fetchOnlineUsers().then((users) => {
      onlineUsers = users
    })
    const onlineUsersInterval = setInterval(async () => {
      onlineUsers = await fetchOnlineUsers()
    }, USER_FETCH_INTERVAL)

    return () => {
      clearInterval(onlineUsersInterval)
    }
  })

  function setPixelColor(x: number, y: number, color: string) {
    const pixel = document.getElementById(`${x}:${y}`)
    if (!pixel) return

    pixel.style.background = color
  }
</script>

<div class="h-screen flex flex-col items-center justify-center">
  {#await data.streamed.pixels}
    <div>Loading pixels</div>
  {:then pixels}
    <div>
      <div class={'flex justify-center p-3'}>
        {#each colors as color}
          <button
            class={`size-10 ${color} hover:border-solid hover:border-2 hover:border-primary 
            ${color === currentColor ? 'border-primary border-2 border-solid' : ''}`}
            style={`background: ${color}`}
            on:click={() => {
              currentColor = color
            }}
          ></button>
        {/each}
      </div>
      <form
        use:enhance={({ formData }) => {
          const coords = formData.get('coords') as string
          const color = formData.get('color') as string

          if (!coords) return

          const [xString, yString] = coords.split(':')

          const x = parseInt(xString)
          const y = parseInt(yString)

          setPixelColor(x,y,color)

          return () => {}
        }}
        on:submit|preventDefault
        method="POST"
        action="?/paint"
        class={'d'}
      >
        <input type="hidden" name="color" value={currentColor} />
        {#each Array(CELLS) as _, y (y)}
          <div class={'flex flex-row'}>
            {#each Array(CELLS) as _, x (x)}
              <button
                id={`${x}:${y}`}
                name="coords"
                value={`${x}:${y}`}
                class={`size-4 hover:border-solid hover:border-2 hover:border-primary`}
                style={`background: ${getColor(pixels, x, y)}`}
              ></button>
            {/each}
          </div>
        {/each}
      </form>
    </div>
  {:catch error}
    <p>Error</p>
  {/await}
  <div class="p-3 gap-3 flex flex-col">
    <div class="text-xl text-center">✨ Who is online ✨</div>
    {#each onlineUsers as onlineUser}
      <p
        class={`p-2 outline outline-solid outline-2 ${onlineUser.name === $userName ? 'outline-purple-400' : ''}`}
      >
        {onlineUser.name}
      </p>
    {/each}
  </div>
</div>
