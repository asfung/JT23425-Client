import { defineStore } from "pinia"
import { useCrypto } from "~/composables/useCrypto"

const { encrypt, decrypt } = useCrypto()
export const useAuthStore = defineStore('AuthStore', {
  state: () => {
    return {
      user: null,
      token: localStorage.getItem('token') || null,
      test: encrypt('HALO'),
    }
  },
  actions: {
    setToken(token){
      this.token = encrypt(token)
      localStorage.setItem('token', encrypt(token))
    },
    getToken(){
      return decrypt(this.token)
    },
    userLogout(){
      localStorage.removeItem('token')
      window.location.href = '/'
    },
    async me(){
      try{
        const { $axios } = useNuxtApp()
        const response = await $axios.get('/me');
        const data = response.data
        this.user = data
        if(response.status === 200){
          return {
            response: response,
            status: response.status,
            data: data,
            message: 'Success',
          }
        }
      }catch(e){
        return {
          status: e.response?.status || 500,
          data: null,
          message: e.response?.data?.message || e.message || 'An error occurred'
        }
      }
    },
    async login(payload){
      try{
        const { $axios } = useNuxtApp()
        const response = await $axios.post('/login', payload);
        const data = response.data
        // if(response.status === 200){
          return {
            response: response,
            status: response.status,
            data: data,
            message: 'Success',
          }
        // }
      }catch(e){
        return {
          status: e.response?.status || 500,
          data: null,
          message: e.response?.data?.message || e.message || 'An error occurred'
        }
      }
    },
    async register(payload){
      try{
        const { $axios } = useNuxtApp()
        const response = await $axios.post('/register', payload);
        const data = response.data
        return {
          response: response,
          status: response.status,
          data: data,
          message: 'Success',
        }
      }catch(e){
        return {
          status: e.response?.status || 500,
          data: null,
          message: e.response?.data?.message || e.message || 'An error occurred'
        }
      }
    },
    async logout(){
      try{
        const { $axios } = useNuxtApp()
        const response = await $axios.post('/logout');
        return {
          response: response,
          status: response.status,
          message: 'Success',
        }
      }catch(e){
        return {
          status: e.response?.status || 500,
          data: null,
          message: e.response?.data?.message || e.message || 'An error occurred'
        }
      }
    },
  },
})