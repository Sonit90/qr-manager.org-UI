import { QueryClient } from '@tanstack/vue-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // disable retries by default (optional)
      refetchOnWindowFocus: false,
    },
  },
})
