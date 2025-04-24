import { defineStore } from "pinia";

export const usePegawaiStore = defineStore('PegawaiStore', {
  state: () => {
    return {
      pegawai: null,
    }
  },
  actions: {
    async getPegawai(payload){
      try{
        const { $axios } = useNuxtApp()
        const response = await $axios.get('/pegawai', {
          params: payload
        });
        const data = response.data.data

        if(response.status === 200){
          this.unitKerja = data
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
    }
  }
})
