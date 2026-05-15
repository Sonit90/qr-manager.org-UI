<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { notify } from '@kyvg/vue3-notification'
import { handleApiError } from '@/api/helpers/handleApiError.ts'
import {
  useQr,
  useQrImage,
  useQrStats,
  useToggleEnabled,
  useUpdateTarget,
  useDeleteQr,
} from '@/modules/qr/composables/useQrs.ts'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)

const { data: qr, isLoading } = useQr(id)
const { data: imageUrl } = useQrImage(id)
const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQrStats(id)

const toggleMutation = useToggleEnabled()
const updateMutation = useUpdateTarget()
const deleteMutation = useDeleteQr()

const editing = ref(false)
const targetDraft = ref('')

watch(
  qr,
  (v) => {
    if (v && !editing.value) targetDraft.value = v.target_url
  },
  { immediate: true },
)

const shortLink = computed(() =>
  qr.value ? `${import.meta.env.VITE_QR_API_URL}/r/${qr.value.code}` : '',
)

const browserRows = computed(() =>
  Object.entries(stats.value?.browser_breakdown ?? {}).map(([browser, count]) => ({
    browser,
    count,
  })),
)
const deviceRows = computed(() =>
  Object.entries(stats.value?.device_breakdown ?? {}).map(([device, count]) => ({
    device,
    count,
  })),
)

async function onToggle(enabled: boolean) {
  if (!qr.value) return
  try {
    await toggleMutation.mutateAsync({ id: qr.value.id, data: { enabled } })
  } catch (e) {
    handleApiError(e, { title: 'Toggle QR' })
  }
}

async function saveTarget() {
  if (!qr.value) return
  try {
    await updateMutation.mutateAsync({ id: qr.value.id, data: { url: targetDraft.value } })
    notify({ type: 'success', title: 'Target URL updated' })
    editing.value = false
  } catch (e) {
    handleApiError(e, { title: 'Update target' })
  }
}

function cancelEdit() {
  if (qr.value) targetDraft.value = qr.value.target_url
  editing.value = false
}

async function onDelete() {
  if (!qr.value) return
  if (!confirm(`Delete QR "${qr.value.code}"?`)) return
  try {
    await deleteMutation.mutateAsync(qr.value.id)
    notify({ type: 'success', title: 'QR deleted' })
    router.push({ name: 'qrs' })
  } catch (e) {
    handleApiError(e, { title: 'Delete QR' })
  }
}

function copyShort() {
  navigator.clipboard.writeText(shortLink.value)
  notify({ type: 'success', title: 'Copied' })
}
</script>

<template>
  <div v-if="isLoading" class="d-flex justify-center pa-12">
    <v-progress-circular indeterminate color="primary" />
  </div>

  <div v-else-if="qr">
    <v-btn
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      variant="text"
      @click="router.push({ name: 'qrs' })"
    >
      Back to list
    </v-btn>

    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>QR Image</v-card-title>
          <v-card-text class="d-flex justify-center">
            <img v-if="imageUrl" :src="imageUrl" alt="QR" style="max-width: 100%; height: auto" />
            <v-progress-circular v-else indeterminate />
          </v-card-text>
          <v-card-text>
            <div class="text-caption">Short link</div>
            <div class="d-flex align-center">
              <code class="flex-grow-1 text-truncate">{{ shortLink }}</code>
              <v-btn icon="mdi-content-copy" variant="text" size="small" @click="copyShort" />
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="d-flex flex-wrap align-center ga-2">
            <span class="text-truncate">{{ qr.code }}</span>
            <v-spacer />
            <v-switch
              :model-value="qr.enabled"
              color="primary"
              hide-details
              density="compact"
              :label="qr.enabled ? 'Enabled' : 'Disabled'"
              @update:model-value="(v) => onToggle(!!v)"
            />
            <v-btn
              color="error"
              variant="text"
              prepend-icon="mdi-delete"
              @click="onDelete"
            >
              Delete
            </v-btn>
          </v-card-title>

          <v-card-text>
            <div class="text-caption">Target URL</div>
            <div v-if="!editing" class="d-flex align-center">
              <a :href="qr.target_url" target="_blank" rel="noopener" class="flex-grow-1">
                {{ qr.target_url }}
              </a>
              <v-btn icon="mdi-pencil" variant="text" size="small" @click="editing = true" />
            </div>
            <div v-else class="d-flex flex-column flex-sm-row align-stretch align-sm-center ga-2">
              <v-text-field
                v-model="targetDraft"
                density="compact"
                hide-details
                autofocus
              />
              <div class="d-flex ga-2">
                <v-btn
                  color="primary"
                  :loading="updateMutation.isPending.value"
                  @click="saveTarget"
                >
                  Save
                </v-btn>
                <v-btn variant="text" @click="cancelEdit">Cancel</v-btn>
              </div>
            </div>

            <v-divider class="my-4" />

            <div class="d-flex flex-wrap ga-4">
              <div>
                <div class="text-caption">Scan count</div>
                <div class="text-h6">{{ qr.scan_count }}</div>
              </div>
              <div>
                <div class="text-caption">Created</div>
                <div>{{ new Date(qr.created_at).toLocaleString() }}</div>
              </div>
              <div>
                <div class="text-caption">Updated</div>
                <div>{{ new Date(qr.updated_at).toLocaleString() }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="mt-4">
          <v-card-title class="d-flex align-center">
            <span>Scan Statistics</span>
            <v-spacer />
            <v-btn icon="mdi-refresh" variant="text" size="small" @click="refetchStats()" />
          </v-card-title>
          <v-card-text>
            <div v-if="statsLoading" class="d-flex justify-center pa-4">
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
                  <div class="text-subtitle-2 mb-2">Device breakdown</div>
                  <v-table v-if="deviceRows.length" density="compact">
                    <thead>
                      <tr>
                        <th>Device</th>
                        <th class="text-right">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="row in deviceRows" :key="row.device">
                        <td>{{ row.device }}</td>
                        <td class="text-right">{{ row.count }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                  <div v-else class="text-medium-emphasis">No data</div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="text-subtitle-2 mb-2">Browser breakdown</div>
                  <v-table v-if="browserRows.length" density="compact">
                    <thead>
                      <tr>
                        <th>Browser</th>
                        <th class="text-right">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="row in browserRows" :key="row.browser">
                        <td>{{ row.browser }}</td>
                        <td class="text-right">{{ row.count }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                  <div v-else class="text-medium-emphasis">No data</div>
                </v-col>
              </v-row>

              <v-divider class="my-4" />

              <div class="text-subtitle-2 mb-2">Recent scans</div>
              <div class="overflow-x-auto">
                <v-table v-if="stats.recent_logs.length" density="compact">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>IP</th>
                      <th>Device</th>
                      <th>Browser</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(log, idx) in stats.recent_logs" :key="idx">
                      <td>{{ new Date(log.timestamp).toLocaleString() }}</td>
                      <td>{{ log.ip ?? '—' }}</td>
                      <td>{{ log.device_type ?? '—' }}</td>
                      <td>{{ log.browser ?? '—' }}</td>
                    </tr>
                  </tbody>
                </v-table>
                <div v-else class="text-medium-emphasis">No scans yet</div>
              </div>
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>

  <v-alert v-else type="error">QR not found</v-alert>
</template>
