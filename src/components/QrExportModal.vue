<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { handleApiError } from '@/api/helpers/handleApiError.ts'
import { ApiClientQr } from '@/api/qr/ApiClientQr.ts'
import { downloadBlob } from '@/helpers/downloadBlob.ts'

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

const form = reactive<{ format: Format; width: number | null; height: number | null }>({
  format: 'svg',
  width: null,
  height: null,
})

const isExporting = ref(false)

const isSvg = computed(() => form.format === 'svg')

const activePreset = computed(() => {
  return (
    PRESETS.find(
      (p) => p.format === form.format && p.width === form.width && p.height === form.height,
    )?.label ?? null
  )
})

const dimError = computed(() => {
  if (isSvg.value) return ''
  if (form.width !== null && (form.width < 150 || form.width > 5000))
    return 'Width must be 150–5000 px'
  if (form.height !== null && (form.height < 150 || form.height > 5000))
    return 'Height must be 150–5000 px'
  return ''
})

const canExport = computed(() => !dimError.value && !isExporting.value)

function applyPreset(preset: Preset) {
  form.format = preset.format
  form.width = preset.width
  form.height = preset.height
}

function selectFormat(format: Format) {
  form.format = format
  if (format === 'svg') {
    form.width = null
    form.height = null
  }
}

function close() {
  if (isExporting.value) return
  form.format = 'svg'
  form.width = null
  form.height = null
  emit('update:open', false)
}

async function doExport() {
  isExporting.value = true
  try {
    const blob = (await ApiClientQr.exportQr(
      {
        id: props.qrId,
        format: form.format,
        width: !isSvg.value ? form.width : null,
        height: !isSvg.value ? form.height : null,
      },
      { format: 'blob' },
    )) as unknown as Blob

    downloadBlob(blob, `${props.qrName || props.qrId}.${form.format}`)
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
              @click="selectFormat(f.value)"
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
                  type="number"
                  :value="form.width ?? ''"
                  class="dim-input"
                  placeholder="1024"
                  min="150"
                  max="5000"
                  @input="
                    (e) => {
                      const v = (e.target as HTMLInputElement).valueAsNumber
                      form.width = isNaN(v) ? null : v
                    }
                  "
                />
              </div>
              <span class="dim-sep">×</span>
              <div class="dim-field">
                <label class="dim-field-label" for="export-height">Height (px)</label>
                <input
                  id="export-height"
                  type="number"
                  :value="form.height ?? ''"
                  class="dim-input"
                  placeholder="1024"
                  min="150"
                  max="5000"
                  @input="
                    (e) => {
                      const v = (e.target as HTMLInputElement).valueAsNumber
                      form.height = isNaN(v) ? null : v
                    }
                  "
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
        <button type="button" class="app-btn app-btn-ghost" :disabled="isExporting" @click="close">
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
