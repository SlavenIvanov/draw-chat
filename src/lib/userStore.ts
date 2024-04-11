import { browser } from '$app/environment'
import { derived, writable } from 'svelte/store'

let initialValue = browser ? window.localStorage.getItem('userName') ?? '' : ''

export const userName = writable<string>(initialValue)

export const lacksName = derived(userName, ($userName) => !$userName)

userName.subscribe((value) => {
  if (browser) {
    window.localStorage.setItem('userName', value)
  }
})
