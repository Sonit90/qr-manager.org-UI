import { useQuery } from '@tanstack/vue-query'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'

export const fetchUserQuery = {
  queryKey: ['fetchUser'],
  queryFn: () => ApiClientV1.userGetCurrentUser(),
  staleTime: 2 * 60 * 1000,
}

export function useUser() {
  return useQuery(fetchUserQuery)
}
