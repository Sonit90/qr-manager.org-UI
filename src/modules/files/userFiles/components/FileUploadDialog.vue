<script setup lang="ts">
import { VFileUpload } from 'vuetify/labs/VFileUpload'
import { useFiles } from '@/modules/files/userFiles/composables/useFiles.ts'
import { nextTick, ref, type Ref } from 'vue'

const { uploading, uploadFile } = useFiles()

const fileToUpload = ref<File | undefined>(undefined)

async function onFileUpload(isActive: Ref<boolean>) {
  if (!fileToUpload.value) {
    return
  }
  const result = await uploadFile(fileToUpload.value)

  if (result) {
    isActive.value = false
    fileToUpload.value = undefined
  }
}

async function onCancel(isActive: Ref<boolean>) {
  fileToUpload.value = undefined
  isActive.value = false
  await nextTick()
}
</script>

<template>
  <v-dialog max-width="600">
    <template #activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" color="primary">
        Upload file
        <v-icon>mdi-upload</v-icon>
      </v-btn>
    </template>
    <template #default="{ isActive }">
      <v-card data-testid="file-upload-body">
        <v-card-title class="d-flex justify-space-between align-center py-1">
          <div class="text-h5 text-medium-emphasis">Upload File</div>
          <v-btn icon="mdi-close" variant="text" @click="onCancel(isActive)" />
        </v-card-title>
        <v-card-text>
          <v-file-upload
            v-model="fileToUpload"
            data-testid="file-upload"
            accept=".csv,.xls,.xlsx"
            density="compact"
            :loading="uploading"
            :disabled="uploading"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text="Cancel" variant="text" @click="onCancel(isActive)" />
          <v-btn
            :disabled="!fileToUpload"
            text="Upload"
            color="primary"
            variant="tonal"
            prepend-icon="mdi-upload"
            @click="onFileUpload(isActive)"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
