<script setup lang="ts">
import type { TypeMergeProcessResponseV1 } from '@/api/__generated__/v1/data-contracts.ts'

defineProps<{
  items: TypeMergeProcessResponseV1[]
  isLoading: boolean
  totalItems: number
}>()

const itemsPerPage = defineModel<number>('itemsPerPage')
const page = defineModel<number>('page')

const emit = defineEmits<{
  download: [fileId: string]
  delete: [fileId: string]
}>()

function onDelete(item: TypeMergeProcessResponseV1) {
  if (!item.id) return

  if (confirm(`Are you sure you want to delete ${item.name} transformation?`)) {
    emit('delete', item.id)
  }
}

const headers = [
  { title: 'Id', key: 'id' },
  { title: 'Name', key: 'name' },
  { title: 'Description', key: 'description' },
  { title: 'Status', key: 'status' },
  { title: 'Created At', key: 'created_at' },
  { title: 'Actions', key: 'actions' },
]
</script>

<template>
  <v-data-table-server
    v-model:items-per-page="itemsPerPage"
    v-model:page="page"
    :items-length="totalItems"
    :loading="isLoading"
    :headers="headers"
    :items="items"
    class="elevation-1"
  >
    <template #item.status="{ item }">
      <v-chip
        :color="
          item.status === 'ready' ? 'success' : item.status === 'pending' ? 'warning' : 'error'
        "
        size="small"
      >
        {{ item.status }}
      </v-chip>
    </template>

    <template #item.created_at="{ item }">
      <template v-if="item.created_at">
        {{ new Date(item.created_at).toLocaleString() }}
      </template>
    </template>

    <template #item.actions="{ item }">
      <div class="d-flex gap-2">
        <v-btn
          variant="text"
          color="error"
          size="small"
          title="Delete"
          icon="mdi-delete"
          @click="onDelete(item)"
        />
      </div>
    </template>
  </v-data-table-server>
</template>
