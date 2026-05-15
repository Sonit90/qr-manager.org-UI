<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { notify } from '@kyvg/vue3-notification'
import { handleApiError } from '@/api/helpers/handleApiError.ts'
import {
  useQrList,
  useCreateQr,
  useDeleteQr,
  useToggleEnabled,
} from '@/modules/qr/composables/useQrs.ts'
import QrCreateDialog from '@/modules/qr/QrCreateDialog.vue'
import type { TypeQrQrCodeResponse } from '@/api/__generated__/qr/data-contracts.ts'

const router = useRouter()
const { data: qrs, isLoading, refetch } = useQrList()
const createMutation = useCreateQr()
const deleteMutation = useDeleteQr()
const toggleMutation = useToggleEnabled()

const createOpen = ref(false)

const headers = [
  { title: 'Code', key: 'code' },
  { title: 'Target URL', key: 'target_url' },
  { title: 'Scans', key: 'scan_count', align: 'end' as const },
  { title: 'Enabled', key: 'enabled' },
  { title: 'Created', key: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]

async function onCreate(target_url: string) {
  try {
    await createMutation.mutateAsync({ target_url })
    notify({ type: 'success', title: 'QR created' })
    createOpen.value = false
  } catch (e) {
    handleApiError(e, { title: 'Create QR' })
  }
}

async function onToggle(qr: TypeQrQrCodeResponse, enabled: boolean) {
  try {
    await toggleMutation.mutateAsync({ id: qr.id, data: { enabled } })
  } catch (e) {
    handleApiError(e, { title: 'Toggle QR' })
  }
}

async function onDelete(qr: TypeQrQrCodeResponse) {
  if (!confirm(`Delete QR "${qr.code}"?`)) return
  try {
    await deleteMutation.mutateAsync(qr.id)
    notify({ type: 'success', title: 'QR deleted' })
  } catch (e) {
    handleApiError(e, { title: 'Delete QR' })
  }
}

function goDetail(qr: TypeQrQrCodeResponse) {
  router.push({ name: 'qr-detail', params: { id: qr.id } })
}

function copyShortLink(qr: TypeQrQrCodeResponse) {
  const url = `${import.meta.env.VITE_QR_API_URL}/r/${qr.code}`
  navigator.clipboard.writeText(url)
  notify({ type: 'success', title: 'Copied', text: url })
}
</script>

<template>
  <v-card>
    <v-card-title class="d-flex flex-wrap align-center ga-2">
      <h1 class="text-h5 text-sm-h4">My QRs</h1>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="createOpen = true">
        New QR
      </v-btn>
      <v-btn icon="mdi-refresh" variant="text" @click="refetch()" />
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="qrs ?? []"
        :loading="isLoading"
        item-value="id"
        density="comfortable"
        mobile-breakpoint="sm"
      >
        <template #item.code="{ item }">
          <code>{{ item.code }}</code>
        </template>
        <template #item.target_url="{ item }">
          <a :href="item.target_url" target="_blank" rel="noopener">{{ item.target_url }}</a>
        </template>
        <template #item.enabled="{ item }">
          <v-switch
            :model-value="item.enabled"
            color="primary"
            hide-details
            density="compact"
            @update:model-value="(v) => onToggle(item, !!v)"
          />
        </template>
        <template #item.created_at="{ item }">
          {{ new Date(item.created_at).toLocaleString() }}
        </template>
        <template #item.actions="{ item }">
          <v-btn icon="mdi-content-copy" variant="text" size="small" @click="copyShortLink(item)" />
          <v-btn icon="mdi-eye" variant="text" size="small" @click="goDetail(item)" />
          <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="onDelete(item)" />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

  <QrCreateDialog
    v-model:open="createOpen"
    :loading="createMutation.isPending.value"
    @submit="onCreate"
  />
</template>
