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
  <section class="panel">
    <div class="panel-head">
      <div>
        <h2 class="panel-head-title">Scan Statistics</h2>
        <p class="panel-head-sub">Aggregate breakdown of recent scan activity.</p>
      </div>
      <button
        type="button"
        class="app-btn app-btn-ghost app-btn-icon"
        aria-label="Refresh stats"
        @click="refetch()"
      >
        <v-icon icon="mdi-refresh" size="18" />
      </button>
    </div>
    <div class="panel-body">
      <div v-if="isLoading" class="loading">
        <v-progress-circular indeterminate />
      </div>
      <template v-else-if="stats">
        <div class="totals">
          <div class="app-stat">
            <div class="app-stat-label">Total scans</div>
            <div class="app-stat-value">{{ stats.total_scans }}</div>
          </div>
        </div>

        <div class="breakdowns">
          <BreakdownTable title="Device breakdown" key-label="Device" :items="deviceItems" />
          <BreakdownTable title="Browser breakdown" key-label="Browser" :items="browserItems" />
        </div>

        <RecentScans :logs="stats.recent_logs" />
      </template>
    </div>
  </section>
</template>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}

.totals {
  margin-bottom: 20px;
  max-width: 240px;
}

.breakdowns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

@media (max-width: 720px) {
  .breakdowns {
    grid-template-columns: 1fr;
  }
}
</style>
