<script setup lang="ts">
import GenericState from '@/components/GenericState.vue'
import MergeHeader from '@/modules/merges/MergeHeader.vue'
import MergeTable from '@/modules/merges/MergeTable.vue'
import { useMerges } from '@/modules/merges/queries/useMerges.ts'
import { useMutation } from '@tanstack/vue-query'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import { handleApiError } from '@/api/helpers/handleApiError.ts'

const { mergeQuery, page, limit } = useMerges()
const { isLoading, isError, data, error, refetch } = mergeQuery

const { mutate: deleteMerge } = useMutation({
  mutationFn: (mergeId: string) => {
    return ApiClientV1.mergeDeleteMergeProcess(mergeId)
  },
  onError: (error) => {
    handleApiError(error, { title: 'Remove transformation' })
  },
})
</script>

<template>
  <h1 class="text-h4">My Transformations</h1>
  <v-card>
    <MergeHeader :is-loading="isLoading" @refresh="refetch" />

    <v-card-text>
      <GenericState
        v-if="isError"
        title="Error"
        :subtitle="error?.message || 'Failed to load transformations. Please try again later.'"
        state="error"
      />
      <GenericState
        v-else-if="data?.data.length === 0 || !data?.data"
        subtitle="There are no transformations to show"
        title="No transformations found"
        state="info"
      />
      <MergeTable
        v-else
        v-model:items-per-page="limit"
        v-model:page="page"
        :is-loading="isLoading"
        :total-items="data.total"
        :items="data?.data || []"
        @delete="deleteMerge($event)"
      />
    </v-card-text>
  </v-card>
</template>
