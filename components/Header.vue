<template>
  <header class="bg-green-400 dark:bg-black text-white p-4 flex justify-start gap-2 items-center shadow-md z-30">
    <button class="lg:hidden" @click="handleisSidebarOpen">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <h1 class="text-xl font-bold">Daftar Pegawai</h1>

    <button @click="setColorTheme(colorMode.preference === 'dark' ? 'light' : 'dark')" class="ml-4">
      <svg v-if="colorMode.value === 'dark'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-50"
        viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd"
          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
          clip-rule="evenodd" />
      </svg>
    </button>
  </header>
</template>

<script setup>
const props = defineProps({
  isSidebarOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:isSidebarOpen'])
const { $screen } = useNuxtApp()
const colorMode = useColorMode()

const setColorTheme = (newTheme) => {
  colorMode.preference = newTheme
  document.documentElement.classList.toggle('my-app-dark')
}

const handleisSidebarOpen = () => {
  emit('update:isSidebarOpen', !props.isSidebarOpen)
}

watch(() => $screen.value.size, (newVal, oldVal) => {
  if(newVal !== oldVal){
    // props.isSidebarOpen = false
    emit('update:isSidebarOpen', false)
  }
})

onMounted(() => {
  if (colorMode.preference === 'dark') {
    document.documentElement.classList.add('my-app-dark')
  }
})
</script>