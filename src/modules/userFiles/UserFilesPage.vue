<script setup lang="ts">
import { useFiles } from '@/modules/userFiles/composables/useFiles.ts'

import FileTable from '@/modules/userFiles/components/FileTable.vue'
import FileCardHeader from '@/modules/userFiles/components/FileCardHeader.vue'
import GenericState from '@/components/GenericState.vue'

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
  <div data-testid="user-files-page">
    <h1 class="text-h4">My Files</h1>
    <v-card>
      <FileCardHeader :loading="loading" @refresh="fetchFiles" />
      <v-card-text>
        <GenericState
          v-if="error"
          title="Error"
          subtitle="Failed to load files. Please try again later."
          state="error"
        />
        <GenericState v-if="loading" title="Loading" state="loading" />
        <GenericState
          v-else-if="files.length === 0"
          subtitle="Upload files to see them here"
          title="No files found"
          state="info"
        />
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
