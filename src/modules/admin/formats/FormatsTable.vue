<script setup lang="ts">
import type { TypeOutputFormatV1 } from '@/api/__generated__/v1/data-contracts.ts'

defineProps<{
  loading: boolean
  formats: TypeOutputFormatV1[]
  deleteId: string | null
}>()

const emit = defineEmits<{
  view: [id: string]
  delete: [id: string]
}>()

function onDelete(format: TypeOutputFormatV1) {
  const label = format.filename || format.id
  if (confirm(`Delete output format "${label}"?`)) {
    emit('delete', format.id)
  }
}

const headers = [
  { title: 'Filename', key: 'filename' },
  { title: 'Description', key: 'description' },
  { title: 'Extension', key: 'output_extension' },
  { title: 'Created At', key: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false },
]
</script>

<template>
  <v-data-table
    :loading="loading"
    :headers="headers"
    :items="formats"
    :items-per-page="10"
    class="elevation-1"
  >
    <template #item.filename="{ item }">
      {{ item.filename || '—' }}
    </template>

    <template #item.description="{ item }">
      {{ item.description || '—' }}
    </template>

    <template #item.created_at="{ item }">
      {{ new Date(item.created_at).toLocaleString() }}
    </template>

    <template #item.actions="{ item }">
      <div class="d-flex gap-2">
        <v-btn
          variant="text"
          color="primary"
          size="small"
          title="View"
          icon="mdi-eye"
          @click="emit('view', item.id)"
        />
        <v-btn
          :disabled="deleteId === item.id"
          variant="text"
          color="error"
          size="small"
          title="Delete"
          icon="mdi-delete"
          @click="onDelete(item)"
        />
      </div>
    </template>
  </v-data-table>
</template>
