<script setup lang="ts">
import type { TypeFileV1 } from '@/api/__generated__/v1/data-contracts.ts'

defineProps<{
  files: TypeFileV1[]
  downloadingFileId: number | null
}>()

const emit = defineEmits<{
  download: [fileId: number]
}>()

function onDownload(fileId?: number) {
  if (!fileId) return

  emit('download', fileId)
}

const headers = [
  { title: 'Name', key: 'name' },
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
      <v-btn
        v-if="item.status === 'ready'"
        variant="text"
        color="primary"
        size="small"
        title="Download"
        :loading="downloadingFileId === item.id"
        :disabled="downloadingFileId !== null"
        @click="onDownload(item.id)"
      >
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>
