<script>
  import { Button } from '$lib/components/ui/button'
  import * as Dialog from '$lib/components/ui/dialog'
  import { Input } from '$lib/components/ui/input'
  import { Toaster } from '$lib/components/ui/sonner'
  import { lacksName, userName } from '$lib/userStore'
  import { ModeWatcher } from 'mode-watcher'
  import '../app.pcss'

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
