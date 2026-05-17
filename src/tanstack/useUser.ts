import { useQuery } from '@tanstack/vue-query'
import { storeToRefs } from 'pinia'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import { useUserStore } from '@/stores/userStore.ts'

export const fetchUserQuery = {
  queryKey: ['fetchUser'],
  queryFn: () => ApiClientV1.me(),
  staleTime: 2 * 60 * 1000,
}

export function useUser() {
  const userStore = useUserStore()
  const { isAuthenticated } = storeToRefs(userStore)
  return useQuery({
    ...fetchUserQuery,
    enabled: isAuthenticated,
  })
}
