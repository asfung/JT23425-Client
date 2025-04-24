export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    console.log('Global Functions PLugin ✅')
  })

  const randomProfileImage = (display_name) => {
    const formattedName = display_name.replace(/\s+/g, "+");
    return `https://eu.ui-avatars.com/api/?background=random&name=${formattedName}`;
  }

  return {
    provide: {
      randomProfileImage,
    }
  }
})