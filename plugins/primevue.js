import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

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
        darkModeSelector: '.my-app-dark',
        // cssLayer: false,
        // cssLayer: {
        //     name: 'primevue',
        //     order: 'theme, base, primevue'
        // }

      }
    }
  }).use(ToastService).use(ConfirmationService);

})
