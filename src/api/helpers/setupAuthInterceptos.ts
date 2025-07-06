import type { AxiosInstance } from 'axios'
import { useUserStore } from '@/stores/userStore.ts'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

interface SetupInterceptorsOptions {
  tokenPrefix?: string
  headerName?: string
}

export function setupAuthInterceptors(
  apiClient: { instance: AxiosInstance },
  options: SetupInterceptorsOptions = {},
) {
  let isRefreshing = false
  const { tokenPrefix = 'Bearer', headerName = 'Authorization' } = options

  // Request interceptor - adds auth header
  const requestInterceptor = apiClient.instance.interceptors.request.use(
    (config) => {
      const { access_token } = useUserStore()

      if (access_token) {
        config.headers[headerName] = `${tokenPrefix} ${access_token}`
      }

      return config
    },
    (error) => Promise.reject(error),
  )

  // Response interceptor - handles token refresh
  const responseInterceptor = apiClient.instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const userStore = useUserStore()
      const { access_token, refresh_token } = storeToRefs(userStore)
      const originalRequest = error.config

      // Check if it's a 401 and we haven't yet tried to refresh
      if ((error.response?.status === 401 || error.response?.status === 403) && !isRefreshing) {
        isRefreshing = true

        if (!refresh_token.value) {
          userStore.clearTokens()
          isRefreshing = false
          throw error
        }

        try {
          await userStore.refreshUser()

          // Retry original request with new token
          originalRequest.headers[headerName] = `${tokenPrefix} ${access_token.value}`
          return apiClient.instance(originalRequest)
        } catch (refreshError) {
          await userStore.clearTokens()
          const router = useRouter()
          await router.push('/login')
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      throw error
    },
  )

  // Return cleanup function
  return () => {
    apiClient.instance.interceptors.request.eject(requestInterceptor)
    apiClient.instance.interceptors.response.eject(responseInterceptor)
  }
}
