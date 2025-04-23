import primeui from 'tailwindcss-primeui'

/** @type {import('tailwindcss').Config} */
    export default {
        theme: {
            extend: {
                options: {
                    cssLayer: {
                        name: 'primevue', //any name you want. will be referenced on app.css
                        order: 'tailwind-base, primeui, tailwind-utilities'
                    }
                },
                borderRadius: {
                    DEFAULT: 'var(--p-content-border-radius)',
                },
            },
        },
        darkMode: ['class', '.app-dark'],
        plugins: [primeui],
    }

