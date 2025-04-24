import axios from 'axios'
import { useAuthStore } from '~/stores/Auth'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const axiosInstance = axios.create({
    baseURL: runtimeConfig.public.baseUrl,
  })

  let isRefreshing = false
  let failedRequests = []

  axiosInstance.interceptors.request.use(
    (config) => {
      const userStore = useAuthStore()
      const token = userStore.getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  axiosInstance.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      const authStore = useAuthStore()
      const originalRequest = error.config

      if (error.response && error.response.data.key === 'refresh-token' && error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          console.log('refreshing ')
          return new Promise((resolve, reject) => {
            failedRequests.push({ resolve, reject })
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return axiosInstance(originalRequest)
            })
            .catch((err) => {
              return Promise.reject(err)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          if (error.response.data.key === 'refresh-token') {
            const response = await axios.post(
              `${runtimeConfig.public.baseUrl}/refresh`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${authStore.getToken()}`,
                },
              }
            )
            const newToken = response.data.authorization.token
            authStore.setToken(newToken) 

            originalRequest.headers.Authorization = `Bearer ${newToken}`

            isRefreshing = false
            failedRequests.forEach((req) => req.resolve(newToken))
            failedRequests = []

            return axiosInstance(originalRequest)
          } else {
            // temporary
            // authStore.userLogout()
            window.location.href = '/'
          }
        } catch (err) {
          isRefreshing = false
          failedRequests.forEach((req) => req.reject(err))
          failedRequests = []
          // authStore.logout()
          return Promise.reject(err)
        }
      }

      return Promise.reject(error)
    }
  )

  nuxtApp.hook('app:mounted', () => {
    console.log('Axios PLugin ✅')
  })

  return {
    provide: { axios: axiosInstance },
  }
})