<script>
  import { Toaster } from '$lib/components/ui/sonner'
  import { ModeWatcher } from 'mode-watcher'
  import '../app.pcss'
  import { lacksName, userName } from '$lib/userStore'
  import * as Dialog from '$lib/components/ui/dialog'
  import { Input } from '$lib/components/ui/input'
  import { Button } from '$lib/components/ui/button'
  import { enhance } from '$app/forms'

  let nameInput = ''
</script>

<Toaster />
<ModeWatcher />

<slot />

<Dialog.Root
  bind:open={$lacksName}
  closeOnOutsideClick={false}
  closeOnEscape={false}
>
  <Dialog.Content>
    <Dialog.Header></Dialog.Header>
    <h1 class="text-2xl">What is your name?</h1>
    <Input bind:value={nameInput} name="userName" />
    <Button
      type="submit"
      on:click={() => {
        userName.set(nameInput)
      }}>Let's Go</Button
    >
  </Dialog.Content>
</Dialog.Root>
