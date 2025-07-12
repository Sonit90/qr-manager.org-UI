<script setup lang="ts">
import { useFiles } from '@/modules/files/userFiles/composables/useFiles.ts'
import FileLoadingState from '@/modules/files/userFiles/components/FileLoadingState.vue'
import FileEmptyState from '@/modules/files/userFiles/components/FileEmptyState.vue'
import FileErrorState from '@/modules/files/userFiles/components/FileErrorState.vue'
import FileTable from '@/modules/files/userFiles/components/FileTable.vue'
import FileCardHeader from '@/modules/files/userFiles/components/FileCardHeader.vue'

const { files, loading, error, deleting, downloadingFileId, fetchFiles, downloadFile, deleteFile } =
  useFiles()

fetchFiles()

function handleDownload(fileId: number) {
  downloadFile(fileId)
}

function handleDelete(fileId: number) {
  deleteFile(fileId)
}
</script>

<template>
  <div>
    <h1 class="text-h4">My Files</h1>

    <v-card class="mb-4">
      <FileCardHeader :loading="loading" @refresh="fetchFiles" />

      <v-card-text>
        <FileErrorState v-if="error" :error="error" />

        <FileLoadingState v-if="loading" />

        <FileEmptyState v-else-if="files.length === 0" />

        <FileTable
          v-else
          :files="files"
          :downloading-file-id="downloadingFileId"
          :deleting="deleting"
          @download="handleDownload"
          @delete="handleDelete"
        />
      </v-card-text>
    </v-card>
  </div>
</template>
