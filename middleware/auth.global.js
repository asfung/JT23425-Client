import { useAuthStore } from "~/stores/Auth"

export default defineNuxtRouteMiddleware((to, from) => {

  const nuxtApp = useNuxtApp()
  const authStore = useAuthStore()
  const token = authStore.getToken()
  const {
    user
  } = storeToRefs(authStore)

  if(to.path === '/login' || to.path === '/register'){
    setPageLayout('none')
  }

  if (!token && !['/login', '/register'].includes(to.path)) {
    return navigateTo('/login');
  }

  if (token && ['/login', '/register'].includes(to.path)) {
    setPageLayout('default')
    return navigateTo('/');
  }

  if(token && !user.value){
    authStore.me()
  }

})