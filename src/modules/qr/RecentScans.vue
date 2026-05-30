<script setup lang="ts">
import { computed } from 'vue'
import type { TypeQrScanLogResponse } from '@/api/__generated__/qr/data-contracts.ts'
import { formatDateTime } from '@/helpers/formatDate.ts'

const props = defineProps<{
  logs: TypeQrScanLogResponse[]
}>()

const headers = [
  { title: 'Time', key: 'time' },
  { title: 'IP', key: 'ip' },
  { title: 'Device', key: 'device' },
  { title: 'Browser', key: 'browser' },
]

const items = computed(() =>
  props.logs.map((log, idx) => ({
    id: idx,
    time: formatDateTime(log.timestamp),
    ip: log.ip ?? '—',
    device: log.device_type ?? '—',
    browser: log.browser ?? '—',
  })),
)
</script>

<template>
  <div v-if="logs.length">
    <v-divider class="my-4" />
    <div class="text-subtitle-2 mb-2">Recent scans</div>
    <v-data-table
      :headers="headers"
      :items="items"
      item-value="id"
      density="compact"
      hide-default-footer
      mobile-breakpoint="sm"
      disable-sort
    />
  </div>
</template>
