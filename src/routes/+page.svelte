<script lang="ts">
  import { browser } from '$app/environment'
  import { enhance } from '$app/forms'
  import { sendHeartbeat } from '$lib/client/heartbeat'
  import * as Card from '$lib/components/ui/card'
  import { CELLS, HEARTBEAT_INTERVAL } from '$lib/constants'
  import { lacksName, userName } from '$lib/userStore'
  import type { PageData } from './$types'

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

      const pixel = document.getElementById(`${x}:${y}`)
      if (!pixel) return

      pixel.style.background = color
    }
    if (!$lacksName) {
      sendHeartbeat($userName)
      setInterval(() => {
        sendHeartbeat($userName)
      }, HEARTBEAT_INTERVAL)
    }
  }
</script>

<div class="align-end">{$userName}</div>
<div class="h-screen flex flex-col items-center justify-center">
  {#await Promise.all([data.streamed.pixels, data.streamed.onlineUsers])}
    <div>Loading pixels</div>
  {:then [pixels, onlineUsers]}
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
        use:enhance={({ submitter }) => {
          //preventing page refresh on submit https://stackoverflow.com/questions/78197915/how-do-i-prevent-page-from-refreshing-when-a-from-component-is-submitted-in-svel
          return async () => {}
        }}
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
    <div class="p-3 gap-3 flex flex-col">
      <div class="text-xl text-center">Who is online 👇</div>
      {#each onlineUsers as onlineUser}
        <p class={' p-2 outline outline-solid outline-2'}>{onlineUser.name}</p>
      {/each}
    </div>
  {:catch error}
    <p>Error</p>
  {/await}
</div>
