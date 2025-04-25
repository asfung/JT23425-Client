import { defineStore } from "pinia";

export const usePegawaiStore = defineStore('PegawaiStore', {
  state: () => {
    return {
      pegawai: null,
    }
  },
  actions: {
    async getPegawai(payload) {
      try {
        const { $axios } = useNuxtApp()
        const response = await $axios.get('/pegawai', {
          params: payload
        });
        const data = response.data.data

        // if (response.status === 200) {
          this.pegawai = data;
          return {
            response: response,
            status: response.status,
            data: data,
            message: 'Success',
          }
        // }

      } catch (e) {
        return {
          status: e.response?.status || 500,
          data: null,
          message: e.response?.data?.message || e.message || 'An error occurred'
        }
      }
    },

    async createPegawai(payload){
      try{
        const { $axios } = useNuxtApp()
        const response = await $axios.post('/pegawai/Create', payload);
        const data = response.data.data
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

    async updatePegawai(payload, id){
      try{
        const { $axios } = useNuxtApp()
        const response = await $axios.post(`/pegawai/${id}/Update`, payload);
        const data = response.data.data
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
    
    async deletePegawai(id){
      try{
        const { $axios } = useNuxtApp()
        const response = await $axios.delete(`/pegawai/${id}/Delete`);
        const data = response.data.data?? null
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

    async exportPegawaiPdf(payload) {
      try {
        const { $axios } = useNuxtApp();
        const response = await $axios.get('/pegawai/ExportPdf', {
          params: payload,
          responseType: 'blob', 
        });
    
        return {
          response: response,
          status: response.status,
          data: response.data, 
          message: 'Success',
        };
      } catch (e) {
        return {
          status: e.response?.status || 500,
          data: null,
          message: e.response?.data?.message || e.message || 'An error occurred',
        };
      }
    }



  }
})
