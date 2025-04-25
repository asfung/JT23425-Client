import { defineStore } from 'pinia';

export const useDepartmentStore = defineStore('DepartmentStore', {
  state: () => ({
    unitKerja: null,
    unitKerjaIdSelected: null,
    jabatanSelected: null,
  }),
  actions: {
    async getTreeUnitKerja() {
      try {
        const { $axios } = useNuxtApp();
        const response = await $axios.get('/unit-kerja/tree');
        const data = response.data.data;
        this.unitKerja = data;
        return {
          response: response,
          status: response.status,
          data: data,
          message: 'Success',
        };
      } catch (e) {
        console.error('Error fetching unit kerja tree:', e);
        return {
          status: e.response?.status || 500,
          data: null,
          message: e.response?.data?.message || e.message || 'An error occurred',
        };
      }
    },

    async getUnitKerja() {
      try {
        const { $axios } = useNuxtApp();
        const response = await $axios.get('/form/unit-kerja');
        const data = response.data.data;
        return {
          response: response,
          status: response.status,
          data: data,
          message: 'Success',
        };
      } catch (e) {
        console.error('Error fetching unit kerja:', e);
        return {
          status: e.response?.status || 500,
          data: null,
          message: e.response?.data?.message || e.message || 'An error occurred',
        };
      }
    },

    async getJabatanByUnitKerja(id) {
      try {
        const { $axios } = useNuxtApp();
        const response = await $axios.get(`/form/${id}/jabatan`);
        const data = response.data.data;
        return {
          response: response,
          status: response.status,
          data: data,
          message: 'Success',
        };
      } catch (e) {
        console.error('Error fetching jabatan by unit kerja:', e);
        return {
          status: e.response?.status || 500,
          data: null,
          message: e.response?.data?.message || e.message || 'An error occurred',
        };
      }
    },

    setSelectedNode(node) {
      if (!node) {
        console.warn('setSelectedNode called with undefined node')
        this.unitKerjaIdSelected = null
        this.jabatanSelected = null
        return;
      }
      if (node.key.startsWith('unit-')) {
        this.unitKerjaIdSelected = node.data.id
        this.jabatanSelected = null
      } else if (node.key.startsWith('jabatan-')) {
        this.unitKerjaIdSelected = null
        this.jabatanSelected = node.data.name
      } else {
        this.unitKerjaIdSelected = null
        this.jabatanSelected = null
      }
    },

    clearSelection() {
      this.unitKerjaIdSelected = null
      this.jabatanSelected = null
    },
  },
});