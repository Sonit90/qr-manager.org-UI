<script setup lang="ts">
import { computed, type MaybeRef } from 'vue'
import { useQrStats } from '@/modules/qr/composables/useQrs.ts'
import BreakdownTable from '@/modules/qr/BreakdownTable.vue'
import RecentScans from '@/modules/qr/RecentScans.vue'

const props = defineProps<{
  id: MaybeRef<string>
}>()

const { data: stats, isLoading, refetch } = useQrStats(props.id)

const deviceItems = computed(() =>
  Object.entries(stats.value?.device_breakdown ?? {}).map(([name, count]) => ({ name, count })),
)

const browserItems = computed(() =>
  Object.entries(stats.value?.browser_breakdown ?? {}).map(([name, count]) => ({ name, count })),
)
</script>

<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <span>Scan Statistics</span>
      <v-spacer />
      <v-btn icon="mdi-refresh" variant="text" size="small" @click="refetch()" />
    </v-card-title>
    <v-card-text>
      <div v-if="isLoading" class="d-flex justify-center pa-4">
        <v-progress-circular indeterminate />
      </div>
      <template v-else-if="stats">
        <div class="d-flex flex-wrap ga-6 mb-4">
          <div>
            <div class="text-caption">Total scans</div>
            <div class="text-h5">{{ stats.total_scans }}</div>
          </div>
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <BreakdownTable title="Device breakdown" key-label="Device" :items="deviceItems" />
          </v-col>
          <v-col cols="12" md="6">
            <BreakdownTable title="Browser breakdown" key-label="Browser" :items="browserItems" />
          </v-col>
        </v-row>

        <RecentScans :logs="stats.recent_logs" />
      </template>
    </v-card-text>
  </v-card>
</template>
