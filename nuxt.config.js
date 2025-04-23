// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    modules: [
        '@nuxt/icon', 
        '@nuxt/eslint',
        // '@nuxtjs/tailwindcss',
        '@primevue/nuxt-module'
    ],
    // primevue: {
    //     options: {
    //         theme: {
    //             preset: Aura,
    //             options: {
    //                 // prefix: 'p',
    //                 darkModeSelector: 'system',
    //                 cssLayer: false,
    //                 // cssLayer: {
    //                 //     name: 'primevue',
    //                 //     order: 'theme, base, primevue'
    //                 // }
    //             }
    //         },
    //     }
    // },
    css: ['~/assets/css/main.css'],
    vite: {
        plugins: [
            tailwindcss(),
        ],
    },
    tailwindcss: {
        cssPath: '~/assets/css/main.css',
        configPath: 'tailwind.config.js',
        exposeConfig: false,
        config: {},
        viewer: true,
    },




    ssr: false,
})
