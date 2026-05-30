import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { useUserStore } from '@/stores/userStore.ts'
import { storeToRefs } from 'pinia'
import { router } from '@/router/router.ts'

interface SetupInterceptorsOptions {
  tokenPrefix?: string
  headerName?: string
  refreshEndpoint?: string
  loginRoute?: string
}

interface RequestQueueItem {
  resolve: (value: any) => void
  reject: (error: any) => void
  config: AxiosRequestConfig
  instance: AxiosInstance
}

let isRefreshing = false
let refreshPromise: Promise<void> | null = null
const requestQueue: RequestQueueItem[] = []

const processQueue = (error: any = null) => {
  requestQueue.forEach(({ resolve, reject, config, instance }) => {
    if (error) {
      reject(error)
    } else {
      resolve(instance(config))
    }
  })
  requestQueue.length = 0
}

export function setupAuthInterceptors(
  apiClient: { instance: AxiosInstance },
  options: SetupInterceptorsOptions = {},
) {
  const {
    tokenPrefix = 'Bearer',
    headerName = 'Authorization',
    refreshEndpoint = '/api/v1/auth/refresh',
    loginRoute = '/login',
  } = options

  // Request interceptor - adds auth header
  const requestInterceptor = apiClient.instance.interceptors.request.use(
    (config) => {
      const userStore = useUserStore()
      const { access_token, refresh_token } = storeToRefs(userStore)

      // Determine which token to use based on endpoint
      const token = config.url === refreshEndpoint ? refresh_token.value : access_token.value

      if (token) {
        config.headers = config.headers || {}
        config.headers[headerName] = `${tokenPrefix} ${token}`
      }

      return config
    },
    (error) => Promise.reject(error),
  )

  // Response interceptor - handles token refresh with request queuing
  const responseInterceptor = apiClient.instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const userStore = useUserStore()
      const { access_token, refresh_token } = storeToRefs(userStore)
      const originalRequest = error.config

      // Only handle 401 errors that aren't from the refresh endpoint
      if (
        error.response?.status === 401 &&
        originalRequest.url !== refreshEndpoint &&
        !originalRequest._retry // Prevent infinite loops
      ) {
        originalRequest._retry = true

        if (!refresh_token.value) {
          userStore.clearTokens()
          await router.push(loginRoute)
          return Promise.reject(error)
        }

        // If already refreshing, queue the request
        if (isRefreshing && refreshPromise) {
          return new Promise((resolve, reject) => {
            requestQueue.push({
              resolve,
              reject,
              config: {
                ...originalRequest,
                headers: {
                  ...originalRequest.headers,
                  [headerName]: `${tokenPrefix} ${access_token.value}`,
                },
              },
              instance: apiClient.instance,
            })
          })
        }

        isRefreshing = true

        try {
          // Create or reuse the refresh promise
          if (!refreshPromise) {
            refreshPromise = userStore.refreshUser()
          }

          await refreshPromise

          // Update the original request with the new token
          originalRequest.headers = originalRequest.headers || {}
          originalRequest.headers[headerName] = `${tokenPrefix} ${access_token.value}`

          // Process any queued requests
          processQueue()

          // Retry the original request
          return apiClient.instance(originalRequest)
        } catch (refreshError) {
          // Clear tokens and redirect on refresh failure
          userStore.clearTokens()
          processQueue(refreshError)

          await router.push(loginRoute)
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
          refreshPromise = null
        }
      }

      return Promise.reject(error)
    },
  )

  return () => {
    apiClient.instance.interceptors.request.eject(requestInterceptor)
    apiClient.instance.interceptors.response.eject(responseInterceptor)
  }
}
