<script lang="ts">
  import { userName } from '$lib/userStore'
</script>

<div class="align-end">{$userName}</div>
<div class="h-screen flex flex-col items-center justify-center">
  <div class={'d'}>
    {#each Array(25) as _, y (y)}
      <div class={'flex flex-row'}>
        {#each Array(25) as _, x (x)}
          <div
            on:click={() => {
              console.log(`${x}:${y}`)
            }}
            class={'w-5 h-5 hover:border-solid hover:border-2 hover:border-primary'}
          ></div>
        {/each}
      </div>
    {/each}
  </div>
</div>
