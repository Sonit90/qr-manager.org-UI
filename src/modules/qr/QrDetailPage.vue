<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { notify } from '@kyvg/vue3-notification'
import { handleApiError } from '@/api/helpers/handleApiError.ts'
import {
  useQr,
  useToggleEnabled,
  useUpdateTarget,
  useDeleteQr,
} from '@/modules/qr/composables/useQrs.ts'
import ScanStats from '@/modules/qr/ScanStats.vue'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)

const { data: qr, isLoading } = useQr(id)

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
    await router.push({ name: 'qrs' })
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
            <img
              v-if="qr.image_url"
              :src="qr.image_url"
              alt="QR"
              style="max-width: 100%; height: auto"
            />
            <v-icon v-else size="120" color="grey-lighten-1">mdi-qrcode</v-icon>
          </v-card-text>
          <v-card-text>
            <div class="text-caption">Short link</div>
            <div class="d-flex align-center">
              <code class="flex-grow-1 text-truncate">{{ shortLink }}</code>
              <v-btn
                icon="mdi-content-copy"
                variant="text"
                size="small"
                data-testid="qr-detail-copy"
                @click="copyShort"
              />
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
            <v-btn color="error" variant="text" prepend-icon="mdi-delete" @click="onDelete">
              Delete
            </v-btn>
          </v-card-title>

          <v-card-text>
            <div class="text-caption">Target URL</div>
            <div v-if="!editing" class="d-flex align-center">
              <a :href="qr.target_url" target="_blank" rel="noopener" class="flex-grow-1">
                {{ qr.target_url }}
              </a>
              <v-btn
                icon="mdi-pencil"
                variant="text"
                size="small"
                data-testid="qr-detail-edit"
                @click="editing = true"
              />
            </div>
            <div v-else class="d-flex flex-column flex-sm-row align-stretch align-sm-center ga-2">
              <v-text-field v-model="targetDraft" density="compact" hide-details autofocus />
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

        <div class="mt-4">
          <ScanStats :id="id" />
        </div>
      </v-col>
    </v-row>
  </div>

  <v-alert v-else type="error">QR not found</v-alert>
</template>
