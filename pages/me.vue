<template>
  <h1 v-if="user">Helo, {{ user.name }}</h1>
</template>

<script setup>
import { useAuthStore } from '~/stores/Auth'

const authStore = useAuthStore()

const {
  user
} = storeToRefs(authStore)

</script>
