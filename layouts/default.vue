<template>
  <div class="min-h-screen flex flex-col">

    <header class="bg-green-400 dark:bg-black text-white p-4 flex justify-between items-center shadow-md z-30">

      <div class="flex items-center gap-2">
        <button class="lg:hidden" @click="isSidebarOpen = !isSidebarOpen">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 class="text-xl font-bold">Daftar Pegawai</h1>
        <button @click="setColorTheme($colorMode.preference === 'dark' ? 'light' : 'dark')" class="ml-4  transition-transform duration-200 ease-in-out active:scale-75 hover:cursor-pointer">
          <svg v-if="$colorMode.value === 'dark'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-50"
            viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <div class="flex items-center">
        <!-- <Button type="button" icon="pi pi-android" severity="secondary" class="mr-5" @click="$router.push('/me')" /> -->
        <Button type="button" icon="pi pi-user" severity="secondary" @click="userPopOver" />
        <Popover ref="popover">
          <div class="flex flex-col gap-4">
            <div v-if="user">
              <p class="font-bold">Helo, {{ user.name }}</p>
              <p class="opacity-60">{{ user.email }}</p>
            </div>
            <div>
              <Button label="Logout" severity="danger" @click="handleLogout" />
            </div>
          </div>
        </Popover>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden relative">
      <aside :class="[
          'bg-gray-300 text-accent-one overflow-y-auto lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out',
          isSidebarOpen ? 'absolute z-30 w-64 h-full translate-x-0' : 'absolute -translate-x-full lg:w-64 lg:static',
        ]">
        <nav class="flex h-full">
          <Sidebar />
        </nav>
      </aside>

      <div v-if="isSidebarOpen" class="absolute inset-0 bg-black/50 z-20 lg:hidden" style="top: 0; left: 0;"
        @click="isSidebarOpen = false"></div>

      <main class="flex-1 p-6 overflow-y-auto bg-white dark:bg-black/10 relative z-10">
        <NuxtPage />
      </main>
    </div>
    <Toast />
  </div>
</template>

<script setup>
import Toast from 'primevue/toast';
import Popover from 'primevue/popover';
import { Button, useToast } from 'primevue';
import { useAuthStore } from '~/stores/Auth';

useHead({
  title: 'Daftar Pegawai'
})

const authStore = useAuthStore()
const colorMode = useColorMode()
const toast = useToast()
const { $screen } = useNuxtApp()
const isSidebarOpen = ref(false)
const popover = ref();
const { user } = storeToRefs(authStore)

const userPopOver = (event) => {
  popover.value.toggle(event);
}

const setColorTheme = (newTheme) => {
  useColorMode().preference = newTheme;
  document.documentElement.classList.toggle('my-app-dark')
}

const handleLogout = async () => {
  try {
    toast.add({
      severity: 'info',
      summary: 'Logout Status',
      detail: 'Harap Tunggu.....',
      life: 0,
    })

    const fetch = await authStore.logout()

    if (fetch.status === 200) {
      toast.removeAllGroups()
      toast.add({
        severity: 'success',
        summary: 'Logout Status',
        detail: fetch.message,
        life: 3000,
      });
      authStore.userLogout()
    } else {
      throw new Error(fetch.message)
    }
  } catch (error) {
    toast.removeAllGroups()
    toast.add({
      severity: 'error',
      summary: 'Logout Status',
      detail: error.message,
      life: 3000,
    })
  }
}


watch(() => $screen.value.size, (newVal, oldVal) => {
  if(newVal !== oldVal){
    isSidebarOpen.value = false
    popover.value.hide()
  }
})

onMounted(() => {
  if(colorMode.preference === 'dark'){
    document.documentElement.classList.toggle('my-app-dark')
  }
})
</script>

