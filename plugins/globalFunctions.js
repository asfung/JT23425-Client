export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    console.log('Global Functions PLugin ✅')
  })

  const imageCache = new Map();

  const randomProfileImage = (display_name) => {
    const formattedName = display_name.replace(/\s+/g, "+");
    return `https://eu.ui-avatars.com/api/?background=random&name=${formattedName}`;
  }

  const pegawaiImageFetch = async (id, name) => {
    const { $axios } = useNuxtApp()
    if (imageCache.has(id)) return imageCache.get(id);

    try {
      const response = await $axios.get(`/pegawai/${id}/ProfileImage`, {
        responseType: 'blob',
      });

      const imageUrl = URL.createObjectURL(response.data);
      imageCache.set(id, imageUrl);
      return imageUrl;
    } catch (error) {
      return randomProfileImage(name);
    }
  };

  const getImageUrl = (path) => {
    const storageUrl = 'http://localhost:8000/storage/'
    return storageUrl + path
  }


  return {
    provide: {
      randomProfileImage,
      pegawaiImageFetch,
      getImageUrl,
    }
  }
})