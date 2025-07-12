<script setup lang="ts">
import FileUploadDialog from './FileUploadDialog.vue'
defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  refresh: []
}>()

function onRefresh() {
  emit('refresh')
}
</script>

<template>
  <v-card-title class="d-flex align-center">
    <v-icon class="me-2">mdi-file-multiple</v-icon>
    Files
    <v-spacer />
    <FileUploadDialog />
    <v-btn
      color="primary"
      prepend-icon="mdi-refresh"
      :loading="loading"
      variant="text"
      @click="onRefresh"
    >
      Refresh
    </v-btn>
  </v-card-title>
  <v-divider />
</template>
