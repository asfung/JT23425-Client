import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';


export default defineNuxtPlugin((nuxtApp) => {
      nuxtApp.hook('app:mounted', () => {
    console.log('primevue PLugin ✅')
  })

nuxtApp.vueApp.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            // prefix: 'p',
            // darkModeSelector: 'light',
            // cssLayer: false,
            // cssLayer: {
            //     name: 'primevue',
            //     order: 'theme, base, primevue'
            // }

        }
    }
 });

})
