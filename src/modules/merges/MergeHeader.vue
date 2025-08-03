<script setup lang="ts">
import MergeCreateDialog from '@/modules/merges/MergeCreateDialog.vue'

defineProps<{
  isLoading: boolean
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
    <v-icon class="me-2">mdi-file-excel</v-icon>
    Transformations
    <v-spacer />
    <MergeCreateDialog />
    <v-btn
      color="primary"
      prepend-icon="mdi-refresh"
      :loading="isLoading"
      variant="text"
      text="Refresh"
      @click="onRefresh"
    />
  </v-card-title>
  <v-divider />
</template>

<style scoped></style>
