import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import { ref } from 'vue'

const limit = ref(50)
const page = ref(1)
const fetchMergesQuery = {
  queryKey: ['fetchMerges', page, limit],
  queryFn: () =>
    ApiClientV1.mergeGetMergeProcesses({
      limit: limit.value,
      skip: (page.value - 1) * limit.value,
    }),
  placeholderData: keepPreviousData,
  staleTime: 5 * 1000,
}

export function useMerges() {
  return { mergeQuery: useQuery(fetchMergesQuery), page, limit }
}
