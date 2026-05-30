<script setup lang="ts">
import { computed, ref } from 'vue'
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
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import QrExportModal from '@/components/QrExportModal.vue'
import { formatDate } from '@/helpers/formatDate.ts'
import type { TypeQrQrCodeResponse } from '@/api/__generated__/qr/data-contracts.ts'

const router = useRouter()
const { data: qrs, isLoading, refetch } = useQrList()
const createMutation = useCreateQr()
const deleteMutation = useDeleteQr()
const toggleMutation = useToggleEnabled()

const createOpen = ref(false)

const search = ref('')
const statusFilter = ref<'all' | 'active' | 'disabled'>('all')

const deleteTarget = ref<TypeQrQrCodeResponse | null>(null)
const exportTarget = ref<TypeQrQrCodeResponse | null>(null)

const filteredQrs = computed(() => {
  const all = qrs.value ?? []
  const term = search.value.trim().toLowerCase()
  return all.filter((qr) => {
    if (statusFilter.value === 'active' && !qr.enabled) return false
    if (statusFilter.value === 'disabled' && qr.enabled) return false
    if (!term) return true
    return (
      (qr.name ?? '').toLowerCase().includes(term) ||
      qr.code.toLowerCase().includes(term) ||
      (qr.target_url ?? '').toLowerCase().includes(term)
    )
  })
})

const headers = [
  { title: 'Preview', key: 'image_url', sortable: false, width: 110 },
  { title: 'Name', key: 'name' },
  { title: 'Target URL', key: 'target_url' },
  { title: 'Scans', key: 'scan_count', align: 'end' as const },
  { title: 'Enabled', key: 'enabled' },
  { title: 'Created', key: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]

const statusTabs = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'disabled', label: 'Disabled' },
] as const

function goDetail(qr: TypeQrQrCodeResponse) {
  router.push({ name: 'qr-detail', params: { id: qr.id } })
}

async function onCreate(payload: { target_url: string; name: string | null }) {
  try {
    await createMutation.mutateAsync(payload)
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

function askDelete(qr: TypeQrQrCodeResponse) {
  deleteTarget.value = qr
}

async function confirmDelete() {
  const target = deleteTarget.value
  if (!target) return
  try {
    await deleteMutation.mutateAsync(target.id)
    notify({ type: 'success', title: 'QR deleted' })
    deleteTarget.value = null
  } catch (e) {
    handleApiError(e, { title: 'Delete QR' })
  }
}

function copyShortLink(qr: TypeQrQrCodeResponse) {
  const url = `${import.meta.env.VITE_QR_API_URL}/r/${qr.code}`
  navigator.clipboard.writeText(url)
  notify({ type: 'success', title: 'Copied', text: url })
}
</script>

<template>
  <div class="app-page">
    <header class="app-page-head">
      <div>
        <span class="app-eyebrow">Dashboard</span>
        <h1 class="app-page-title">My QRs</h1>
        <p class="app-page-sub">Create, edit, and manage every QR code in one place.</p>
      </div>
      <div class="page-head-actions">
        <button
          type="button"
          class="app-btn app-btn-ghost app-btn-icon"
          data-testid="qr-refresh"
          aria-label="Refresh"
          @click="refetch()"
        >
          <v-icon icon="mdi-refresh" size="20" />
        </button>
        <button type="button" class="app-btn app-btn-primary" @click="createOpen = true">
          <v-icon icon="mdi-plus" size="18" />
          New QR
        </button>
      </div>
    </header>

    <section class="panel">
      <div class="panel-head toolbar">
        <div class="search-wrap">
          <v-icon icon="mdi-magnify" size="18" class="search-icon" />
          <input
            v-model="search"
            type="text"
            class="search-input"
            placeholder="Search by name, code, or URL"
            aria-label="Search QR codes"
          />
        </div>
        <div class="status-tabs" role="tablist" aria-label="Filter by status">
          <button
            v-for="tab in statusTabs"
            :key="tab.value"
            type="button"
            role="tab"
            class="status-tab"
            :class="{ 'status-tab-active': statusFilter === tab.value }"
            :aria-selected="statusFilter === tab.value"
            @click="statusFilter = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="panel-body panel-body-flush">
        <v-data-table
          :headers="headers"
          :items="filteredQrs"
          :loading="isLoading"
          item-value="id"
          density="comfortable"
          mobile-breakpoint="sm"
          disable-sort
          hide-default-footer
          class="qrs-table"
        >
          <template #item.image_url="{ item }">
            <div class="qr-thumb">
              <img
                v-if="item.image_url"
                :src="item.image_url"
                alt="QR preview"
                width="72"
                height="72"
              />
              <v-icon v-else size="40" color="grey-lighten-1">mdi-qrcode</v-icon>
            </div>
          </template>
          <template #item.name="{ item }">
            <div class="cell-name">
              <span class="cell-name-main">{{ item.name || item.code }}</span>
              <span v-if="item.name" class="cell-name-sub">{{ item.code }}</span>
            </div>
          </template>
          <template #item.target_url="{ item }">
            <a :href="item.target_url" target="_blank" rel="noopener" class="cell-link">
              {{ item.target_url }}
            </a>
          </template>
          <template #item.scan_count="{ item }">
            <span class="cell-scans">{{ item.scan_count ?? 0 }}</span>
          </template>
          <template #item.enabled="{ item }">
            <div class="cell-status">
              <v-switch
                :model-value="item.enabled"
                color="primary"
                hide-details
                density="compact"
                :aria-label="`Toggle ${item.name || item.code}`"
                @update:model-value="(v) => onToggle(item, !!v)"
              />
              <span
                class="app-badge"
                :class="item.enabled ? 'app-badge-success' : 'app-badge-muted'"
              >
                {{ item.enabled ? 'Active' : 'Disabled' }}
              </span>
            </div>
          </template>
          <template #item.created_at="{ item }">
            <span class="cell-date">{{ formatDate(item.created_at) }}</span>
          </template>
          <template #item.actions="{ item }">
            <div class="cell-actions">
              <button
                type="button"
                class="app-btn app-btn-ghost app-btn-icon"
                data-testid="qr-copy-link"
                aria-label="Copy short link"
                @click="copyShortLink(item)"
              >
                <v-icon icon="mdi-content-copy" size="18" />
              </button>
              <button
                type="button"
                class="app-btn app-btn-ghost app-btn-icon"
                data-testid="qr-export"
                aria-label="Export QR"
                @click="exportTarget = item"
              >
                <v-icon icon="mdi-download" size="18" />
              </button>
              <button
                type="button"
                class="app-btn app-btn-ghost app-btn-icon"
                data-testid="qr-view"
                aria-label="View details"
                @click="goDetail(item)"
              >
                <v-icon icon="mdi-eye" size="18" />
              </button>
              <button
                type="button"
                class="app-btn app-btn-ghost app-btn-icon delete-btn"
                data-testid="qr-delete"
                aria-label="Delete QR"
                @click="askDelete(item)"
              >
                <v-icon icon="mdi-delete-outline" size="18" />
              </button>
            </div>
          </template>
          <template #no-data>
            <div class="app-empty">
              <div class="app-empty-icon">
                <v-icon icon="mdi-qrcode-scan" size="28" />
              </div>
              <h3 class="app-empty-title">No QR codes yet</h3>
              <p>Create your first QR code to start tracking scans.</p>
              <button type="button" class="app-btn app-btn-primary mt-3" @click="createOpen = true">
                <v-icon icon="mdi-plus" size="18" />
                Create QR Code
              </button>
            </div>
          </template>
        </v-data-table>
      </div>
    </section>

    <QrCreateDialog
      v-model:open="createOpen"
      :loading="createMutation.isPending.value"
      @submit="onCreate"
    />

    <QrExportModal
      :open="!!exportTarget"
      :qr-id="exportTarget?.id ?? ''"
      :qr-name="exportTarget?.name || exportTarget?.code || ''"
      @update:open="(v) => !v && (exportTarget = null)"
    />

    <ConfirmDialog
      :open="!!deleteTarget"
      title="Delete QR code?"
      :message="`This will permanently remove '${deleteTarget?.name || deleteTarget?.code}'. This action cannot be undone.`"
      confirm-text="Delete"
      danger
      :loading="deleteMutation.isPending.value"
      @update:open="(v) => !v && (deleteTarget = null)"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.page-head-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toolbar {
  justify-content: space-between;
  gap: 18px;
}

.search-wrap {
  position: relative;
  flex: 1;
  min-width: 220px;
  max-width: 360px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 9px 12px 9px 36px;
  font-size: 14px;
  background: var(--bg-soft);
  color: var(--ink);
  outline: none;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}

.search-input:focus {
  background: #fff;
  border-color: var(--accent);
}

.status-tabs {
  display: inline-flex;
  background: var(--bg-soft);
  padding: 4px;
  border-radius: 999px;
  border: 1px solid var(--line);
}

.status-tab {
  border: none;
  background: transparent;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.status-tab:hover {
  color: var(--ink);
}

.status-tab-active {
  background: #fff;
  color: var(--ink);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
}

.qr-thumb {
  width: 64px;
  height: 64px;
  border: 1px solid var(--line);
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-soft);
  padding: 4px;
}

.qr-thumb img {
  width: 56px;
  height: 56px;
  display: block;
  border-radius: 8px;
}

.cell-name {
  display: flex;
  flex-direction: column;
}

.cell-name-main {
  font-weight: 600;
  color: var(--ink);
}

.cell-name-sub {
  font-size: 12px;
  color: var(--muted);
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
}

.cell-link {
  color: var(--accent);
  text-decoration: none;
  max-width: 280px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.cell-link:hover {
  text-decoration: underline;
}

.cell-scans {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.cell-status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.cell-date {
  color: var(--muted);
  font-size: 13px;
}

.cell-actions {
  display: inline-flex;
  gap: 4px;
  justify-content: flex-end;
}

.delete-btn:hover {
  color: var(--danger);
  background: rgba(239, 68, 68, 0.08);
}

.mt-3 {
  margin-top: 12px;
}

@media (max-width: 640px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-wrap {
    max-width: 100%;
  }

  .status-tabs {
    align-self: flex-start;
  }
}
</style>
