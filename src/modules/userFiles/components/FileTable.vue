<script setup lang="ts">
import type { TypeFileV1 } from '@/api/__generated__/v1/data-contracts.ts'

defineProps<{
  files: TypeFileV1[]
  downloadingFileId: string | null
  deleting: boolean
}>()

const emit = defineEmits<{
  download: [fileId: string]
  delete: [fileId: string]
}>()

function onDownload(fileId?: TypeFileV1['id']) {
  if (!fileId) return
  emit('download', fileId)
}

function onDelete(item: TypeFileV1) {
  if (!item.id) return

  if (confirm(`Are you sure you want to delete ${item.original_name} file?`)) {
    emit('delete', item.id)
  }
}

const headers = [
  { title: 'Original Name', key: 'original_name' },
  { title: 'Column Count', key: 'column_count' },
  { title: 'Row Count', key: 'row_count' },
  { title: 'Status', key: 'status' },
  { title: 'Created At', key: 'created_at' },
  { title: 'Actions', key: 'actions' },
]
</script>

<template>
  <v-data-table :headers="headers" :items="files" :items-per-page="10" class="elevation-1">
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
          v-if="item.status === 'processed'"
          variant="text"
          color="primary"
          size="small"
          title="Download"
          icon="mdi-download"
          :loading="downloadingFileId === item.id"
          :disabled="downloadingFileId !== null"
          @click="onDownload(item.id)"
        />

        <v-btn
          variant="text"
          color="error"
          size="small"
          title="Delete"
          icon="mdi-delete"
          :disabled="downloadingFileId !== null"
          @click="onDelete(item)"
        />
      </div>
    </template>
  </v-data-table>
</template>
