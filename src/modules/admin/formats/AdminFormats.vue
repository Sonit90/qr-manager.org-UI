<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAdminFormats } from '@/modules/admin/formats/composables/useAdminFormats.ts'
import FormatsTable from '@/modules/admin/formats/FormatsTable.vue'

const router = useRouter()
const { formats, loading, deleteId, fetchFormats, deleteFormat } = useAdminFormats()

fetchFormats()

function onView(id: string) {
  router.push({ name: 'format-detail', params: { id } })
}

function onCreate() {
  router.push({ name: 'format-create' })
}
</script>

<template>
  <v-card class="mb-4">
    <v-card-title class="d-flex">
      <h1 class="text-h4">Output Formats</h1>
      <v-spacer />
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        text="New format"
        @click="onCreate()"
      />
    </v-card-title>
    <v-card-text>
      <FormatsTable
        :loading="loading"
        :formats="formats"
        :delete-id="deleteId"
        @view="onView($event)"
        @delete="deleteFormat($event)"
      />
    </v-card-text>
  </v-card>
</template>
