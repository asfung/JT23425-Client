export const useFormOptions = () => {
  const { $axios } = useNuxtApp();

  const handleError = (e) => ({
    status: e.response?.status || 500,
    data: null,
    message: e.response?.data?.message || e.message || 'An error occurred',
  });

  const getGolongan = async () => {
    try {
      const response = await $axios.get('/form/golongan');
      return {
        status: response.status,
        data: response.data.data,
        message: 'Success',
      };
    } catch (e) {
      return handleError(e);
    }
  };

  const getEselon = async () => {
    try {
      const response = await $axios.get('/form/eselon');
      return {
        status: response.status,
        data: response.data.data,
        message: 'Success',
      };
    } catch (e) {
      return handleError(e);
    }
  };

  const getJenisKelamin = async () => {
    try {
      const response = await $axios.get('/form/jenis-kelamin');
      return {
        status: response.status,
        data: response.data.data,
        message: 'Success',
      };
    } catch (e) {
      return handleError(e);
    }
  };

  const getUnitKerja = async () => {
    try {
      const response = await $axios.get('/form/unit-kerja');
      return {
        status: response.status,
        data: response.data.data,
        message: 'Success',
      };
    } catch (e) {
      return handleError(e);
    }
  };

  const getJabatanByUnitKerja = async (id) => {
    try {
      const response = await $axios.get(`/form/${id}/jabatan`);
      return {
        status: response.status,
        data: response.data.data,
        message: 'Success',
      };
    } catch (e) {
      return handleError(e);
    }
  };

  const getAgama = async () => {
    try {
      const response = await $axios.get('/form/agama');
      return {
        status: response.status,
        data: response.data.data,
        message: 'Success',
      };
    } catch (e) {
      return handleError(e);
    }
  };

  const searchCities = async (query) => {
    try {
      const response = await $axios.get('/form/cities', {
        params: { q: query }
      });
      return {
        status: response.status,
        data: response.data.data,
        message: 'Success',
      };
    } catch (e) {
      return handleError(e);
    }
  };

  return {
    getGolongan,
    getEselon,
    getJenisKelamin,
    getUnitKerja,
    getJabatanByUnitKerja,
    getAgama,
    searchCities
  };
};
