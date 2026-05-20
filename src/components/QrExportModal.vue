<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { handleApiError } from '@/api/helpers/handleApiError.ts'

const props = defineProps<{
  open: boolean
  qrId: string
  qrName: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

type Format = 'svg' | 'png' | 'jpeg' | 'webp'

interface Preset {
  label: string
  sub: string
  format: Format
  width: number | null
  height: number | null
}

const PRESETS: Preset[] = [
  { label: 'Web', sub: '512×512 PNG', format: 'png', width: 512, height: 512 },
  { label: 'Print', sub: '2000×2000 PNG', format: 'png', width: 2000, height: 2000 },
  { label: 'T-Shirt', sub: 'SVG vector', format: 'svg', width: null, height: null },
  { label: 'Poster', sub: '4000×4000 PNG', format: 'png', width: 4000, height: 4000 },
]

const FORMAT_OPTIONS: { value: Format; label: string }[] = [
  { value: 'svg', label: 'SVG' },
  { value: 'png', label: 'PNG' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'webp', label: 'WebP' },
]

const form = reactive<{ format: Format; width: string; height: string }>({
  format: 'svg',
  width: '',
  height: '',
})

const isExporting = ref(false)
const activePreset = ref<string | null>('T-Shirt')

const isSvg = computed(() => form.format === 'svg')

const dimError = computed(() => {
  if (isSvg.value) return ''
  if (form.width) {
    const w = Number(form.width)
    if (w < 150 || w > 5000) return 'Width must be 150–5000 px'
  }
  if (form.height) {
    const h = Number(form.height)
    if (h < 150 || h > 5000) return 'Height must be 150–5000 px'
  }
  return ''
})

const canExport = computed(() => !dimError.value && !isExporting.value)

watch(
  () => props.open,
  (v) => {
    if (v) {
      form.format = 'svg'
      form.width = ''
      form.height = ''
      activePreset.value = 'T-Shirt'
    }
  },
)

function applyPreset(preset: Preset) {
  activePreset.value = preset.label
  form.format = preset.format
  form.width = preset.width ? String(preset.width) : ''
  form.height = preset.height ? String(preset.height) : ''
}

watch(
  () => form.format,
  () => {
    activePreset.value = null
  },
)

function close() {
  if (!isExporting.value) emit('update:open', false)
}

async function doExport() {
  isExporting.value = true
  try {
    const qs = new URLSearchParams({ format: form.format })
    if (!isSvg.value && form.width) qs.set('width', form.width)
    if (!isSvg.value && form.height) qs.set('height', form.height)

    const url = `${import.meta.env.VITE_QR_API_URL}/api/v1/qr/${props.qrId}/export?${qs}`
    const token = localStorage.getItem('access_token')

    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!response.ok) throw new Error(`Export failed: ${response.statusText}`)

    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = objectUrl
    a.download = `${props.qrName || props.qrId}.${form.format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(objectUrl)
    close()
  } catch (e) {
    handleApiError(e, { title: 'Export QR' })
  } finally {
    isExporting.value = false
  }
}
</script>

<template>
  <v-dialog :model-value="open" max-width="460" class="app-dialog" @update:model-value="close">
    <v-card class="export-card">
      <div class="app-dialog-title">
        <h3>Export QR Code</h3>
        <button class="app-btn app-btn-ghost app-btn-icon" aria-label="Close" @click="close">
          <v-icon icon="mdi-close" size="18" />
        </button>
      </div>

      <div class="app-dialog-body export-body">
        <div class="export-section">
          <div class="export-label">Quick presets</div>
          <div class="presets-row">
            <button
              v-for="preset in PRESETS"
              :key="preset.label"
              type="button"
              class="preset-btn"
              :class="{ 'preset-btn-active': activePreset === preset.label }"
              @click="applyPreset(preset)"
            >
              <span class="preset-name">{{ preset.label }}</span>
              <span class="preset-sub">{{ preset.sub }}</span>
            </button>
          </div>
        </div>

        <div class="export-section">
          <div class="export-label">Format</div>
          <div class="format-tabs">
            <button
              v-for="f in FORMAT_OPTIONS"
              :key="f.value"
              type="button"
              class="format-tab"
              :class="{ 'format-tab-active': form.format === f.value }"
              @click="form.format = f.value"
            >
              {{ f.label }}
            </button>
          </div>
        </div>

        <div class="export-section">
          <div class="export-label">Dimensions</div>
          <p v-if="isSvg" class="dim-note">
            <v-icon icon="mdi-vector-square" size="15" />
            SVG is vector — scales to any size without quality loss.
          </p>
          <template v-else>
            <div class="dim-row">
              <div class="dim-field">
                <label class="dim-field-label" for="export-width">Width (px)</label>
                <input
                  id="export-width"
                  v-model="form.width"
                  type="number"
                  class="dim-input"
                  placeholder="1024"
                  min="150"
                  max="5000"
                />
              </div>
              <span class="dim-sep">×</span>
              <div class="dim-field">
                <label class="dim-field-label" for="export-height">Height (px)</label>
                <input
                  id="export-height"
                  v-model="form.height"
                  type="number"
                  class="dim-input"
                  placeholder="1024"
                  min="150"
                  max="5000"
                />
              </div>
            </div>
            <p v-if="dimError" class="dim-error">
              <v-icon icon="mdi-alert-circle-outline" size="14" />
              {{ dimError }}
            </p>
            <p v-else class="dim-hint">Leave blank for server default. Range: 150–5000 px.</p>
          </template>
        </div>
      </div>

      <div class="app-dialog-actions">
        <button
          type="button"
          class="app-btn app-btn-ghost"
          :disabled="isExporting"
          @click="close"
        >
          Cancel
        </button>
        <button
          type="button"
          class="app-btn app-btn-primary"
          :disabled="!canExport"
          @click="doExport"
        >
          <v-progress-circular v-if="isExporting" size="14" width="2" indeterminate />
          <v-icon v-else icon="mdi-download" size="16" />
          Download
        </button>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.export-card {
  border-radius: var(--radius-lg) !important;
  border: 1px solid var(--line);
  box-shadow: var(--shadow-card) !important;
}

.export-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.export-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.export-label {
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
}

.presets-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.preset-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 10px 6px;
  border: 1.5px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--bg-soft);
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
  text-align: center;
}

.preset-btn:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.preset-btn-active {
  border-color: var(--accent) !important;
  background: var(--accent-soft) !important;
}

.preset-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink);
}

.preset-sub {
  font-size: 10.5px;
  color: var(--muted);
  line-height: 1.3;
}

.format-tabs {
  display: inline-flex;
  background: var(--bg-soft);
  padding: 3px;
  border-radius: 999px;
  border: 1px solid var(--line);
}

.format-tab {
  border: none;
  background: transparent;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.format-tab:hover {
  color: var(--ink);
}

.format-tab-active {
  background: #fff;
  color: var(--ink);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
}

.dim-note {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0;
  padding: 10px 14px;
  background: var(--accent-soft);
  border-radius: var(--radius-sm);
  color: var(--accent);
}

.dim-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.dim-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.dim-field-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-2);
}

.dim-input {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 9px 12px;
  font-size: 14px;
  background: var(--bg-soft);
  color: var(--ink);
  outline: none;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}

.dim-input:focus {
  background: #fff;
  border-color: var(--accent);
}

.dim-sep {
  font-size: 18px;
  color: var(--muted);
  padding-bottom: 9px;
}

.dim-error {
  font-size: 12.5px;
  color: var(--danger);
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
}

.dim-hint {
  font-size: 12px;
  color: var(--muted);
  margin: 0;
}
</style>
