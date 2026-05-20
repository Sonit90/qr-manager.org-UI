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
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import QrExportModal from '@/components/QrExportModal.vue'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)

const { data: qr, isLoading } = useQr(id)

const toggleMutation = useToggleEnabled()
const updateMutation = useUpdateTarget()
const deleteMutation = useDeleteQr()

const editing = ref(false)
const targetDraft = ref('')
const deleteOpen = ref(false)
const exportOpen = ref(false)

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

const displayName = computed(() => qr.value?.name || qr.value?.code || '')

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

async function confirmDelete() {
  if (!qr.value) return
  try {
    await deleteMutation.mutateAsync(qr.value.id)
    notify({ type: 'success', title: 'QR deleted' })
    deleteOpen.value = false
    await router.push({ name: 'qrs' })
  } catch (e) {
    handleApiError(e, { title: 'Delete QR' })
  }
}

function copyShort() {
  navigator.clipboard.writeText(shortLink.value)
  notify({ type: 'success', title: 'Copied' })
}

function formatDateTime(value?: string) {
  if (!value) return ''
  return new Date(value).toLocaleString()
}
</script>

<template>
  <div class="app-page qr-detail">
    <button
      type="button"
      class="app-btn app-btn-ghost back-btn"
      @click="router.push({ name: 'qrs' })"
    >
      <v-icon icon="mdi-arrow-left" size="18" />
      Back to list
    </button>

    <div v-if="isLoading" class="loading-state">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <template v-else-if="qr">
      <header class="qr-detail-head">
        <div>
          <span class="app-eyebrow">QR Code</span>
          <h1 class="app-page-title">{{ displayName }}</h1>
          <div class="qr-meta-row">
            <span v-if="qr.name" class="qr-code-chip">{{ qr.code }}</span>
            <span class="app-page-sub qr-meta-sub">Manage destination, status, and analytics.</span>
          </div>
        </div>
        <span class="app-badge" :class="qr.enabled ? 'app-badge-success' : 'app-badge-muted'">
          <span class="status-pip" :class="{ 'status-pip-off': !qr.enabled }" />
          {{ qr.enabled ? 'Active' : 'Disabled' }}
        </span>
      </header>

      <div class="qr-grid">
        <aside class="panel qr-aside">
          <div class="panel-body qr-image-wrap">
            <div class="qr-image-frame">
              <img v-if="qr.image_url" :src="qr.image_url" alt="QR" class="qr-image-img" />
              <v-icon v-else size="120" color="grey-lighten-1">mdi-qrcode</v-icon>
            </div>
            <div class="qr-image-meta">
              <div class="meta-label">Short link</div>
              <div class="short-link-row">
                <code class="short-link">{{ shortLink }}</code>
                <button
                  type="button"
                  class="app-btn app-btn-ghost app-btn-icon"
                  data-testid="qr-detail-copy"
                  aria-label="Copy short link"
                  @click="copyShort"
                >
                  <v-icon icon="mdi-content-copy" size="16" />
                </button>
              </div>
            </div>
            <div class="qr-actions">
              <button
                type="button"
                class="app-btn app-btn-primary app-btn-block"
                @click="exportOpen = true"
              >
                <v-icon icon="mdi-download" size="16" />
                Export
              </button>
            </div>
          </div>
        </aside>

        <div class="qr-main">
          <section class="panel">
            <div class="panel-head">
              <div>
                <h2 class="panel-head-title">Destination</h2>
                <p class="panel-head-sub">Change the URL this code redirects to.</p>
              </div>
              <v-switch
                :model-value="qr.enabled"
                color="primary"
                hide-details
                density="compact"
                :label="qr.enabled ? 'Enabled' : 'Disabled'"
                @update:model-value="(v) => onToggle(!!v)"
              />
            </div>
            <div class="panel-body">
              <div v-if="!editing" class="url-row">
                <a :href="qr.target_url" target="_blank" rel="noopener" class="url-display">
                  {{ qr.target_url }}
                </a>
                <button
                  type="button"
                  class="app-btn app-btn-ghost app-btn-icon"
                  data-testid="qr-detail-edit"
                  aria-label="Edit destination"
                  @click="editing = true"
                >
                  <v-icon icon="mdi-pencil" size="16" />
                </button>
              </div>
              <div v-else class="url-edit">
                <v-text-field
                  v-model="targetDraft"
                  density="comfortable"
                  variant="outlined"
                  hide-details
                  autofocus
                  placeholder="https://example.com"
                />
                <div class="url-edit-actions">
                  <button
                    type="button"
                    class="app-btn app-btn-ghost"
                    :disabled="updateMutation.isPending.value"
                    @click="cancelEdit"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="app-btn app-btn-primary"
                    :disabled="updateMutation.isPending.value"
                    @click="saveTarget"
                  >
                    <v-progress-circular
                      v-if="updateMutation.isPending.value"
                      size="14"
                      width="2"
                      indeterminate
                    />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div class="stats-grid">
            <div class="app-stat">
              <div class="app-stat-label">Total scans</div>
              <div class="app-stat-value">{{ qr.scan_count ?? 0 }}</div>
            </div>
            <div class="app-stat">
              <div class="app-stat-label">Created</div>
              <div class="app-stat-value sm">{{ formatDateTime(qr.created_at) }}</div>
            </div>
            <div class="app-stat">
              <div class="app-stat-label">Last updated</div>
              <div class="app-stat-value sm">{{ formatDateTime(qr.updated_at) }}</div>
            </div>
          </div>

          <ScanStats :id="id" />

          <section class="panel danger-zone">
            <div class="panel-head">
              <div>
                <h2 class="panel-head-title">Danger zone</h2>
                <p class="panel-head-sub">Permanently delete this QR code.</p>
              </div>
            </div>
            <div class="panel-body danger-body">
              <p class="danger-text">
                Once deleted, the QR code stops redirecting and cannot be restored.
              </p>
              <button
                type="button"
                class="app-btn app-btn-danger"
                data-testid="qr-detail-delete"
                @click="deleteOpen = true"
              >
                <v-icon icon="mdi-delete-outline" size="16" />
                Delete QR code
              </button>
            </div>
          </section>
        </div>
      </div>
    </template>

    <v-alert v-else type="error" class="not-found">QR not found</v-alert>

    <QrExportModal v-model:open="exportOpen" :qr-id="id" :qr-name="displayName" />

    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Delete QR code?"
      :message="`This will permanently remove '${displayName}'. This action cannot be undone.`"
      confirm-text="Delete"
      danger
      :loading="deleteMutation.isPending.value"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.qr-detail {
  gap: 20px;
}

.back-btn {
  align-self: flex-start;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 64px 0;
}

.qr-detail-head {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  align-items: flex-end;
}

.qr-meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 6px;
}

.qr-code-chip {
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink-2);
  background: var(--bg-soft);
  border: 1px solid var(--line);
  padding: 4px 10px;
  border-radius: 999px;
}

.qr-meta-sub {
  margin: 0;
}

.status-pip {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.18);
}

.status-pip-off {
  background: var(--muted);
  box-shadow: 0 0 0 3px rgba(100, 116, 139, 0.18);
}

.qr-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  align-items: start;
}

.qr-aside {
  position: sticky;
  top: calc(var(--header-height) + 24px);
}

.qr-image-wrap {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.qr-image-frame {
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-image-img {
  max-width: 100%;
  height: auto;
  display: block;
}

.meta-label {
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
  font-weight: 600;
  margin-bottom: 6px;
}

.short-link-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.short-link {
  flex: 1;
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 12.5px;
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ink-2);
}

.qr-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.qr-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.url-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.url-display {
  flex: 1;
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  word-break: break-all;
}

.url-display:hover {
  text-decoration: underline;
}

.url-edit {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.url-edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.app-stat-value.sm {
  font-size: 14.5px;
  font-weight: 600;
  color: var(--ink-2);
  letter-spacing: 0;
}

.danger-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.danger-text {
  margin: 0;
  color: var(--ink-2);
  font-size: 14px;
}

.not-found {
  border-radius: var(--radius);
}

@media (max-width: 960px) {
  .qr-grid {
    grid-template-columns: 1fr;
  }

  .qr-aside {
    position: static;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
