<script setup lang="ts">
import { computed } from 'vue'
import type {
  TypeOutputColumnV1,
  TypeColumnTypeV1,
  TypeDatetimeFormatV1,
} from '@/api/__generated__/v1/data-contracts.ts'

const props = defineProps<{
  modelValue: TypeOutputColumnV1
  index: number
}>()

const emit = defineEmits<{
  'update:modelValue': [col: TypeOutputColumnV1]
  remove: []
}>()

function update<K extends keyof TypeOutputColumnV1>(key: K, value: TypeOutputColumnV1[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

const colTypeKind = computed(() => props.modelValue.col_type?.kind ?? 'string')

const datetimeType = computed(() => {
  const ct = props.modelValue.col_type
  if (ct?.kind === 'datetime') return ct.format.type
  return 'iso8601'
})

const datetimePattern = computed(() => {
  const ct = props.modelValue.col_type
  if (ct?.kind === 'datetime' && ct.format.type === 'custom') return ct.format.pattern
  return ''
})

function setColTypeKind(kind: string) {
  let next: TypeColumnTypeV1
  if (kind === 'datetime') {
    next = { kind: 'datetime', format: { type: 'iso8601' } }
  } else {
    next = { kind: kind as 'string' | 'integer' | 'float' | 'boolean' }
  }
  update('col_type', next)
}

function setDatetimeType(type: string) {
  let format: TypeDatetimeFormatV1
  if (type === 'custom') {
    format = { type: 'custom', pattern: '' }
  } else if (type === 'unix') {
    format = { type: 'unix' }
  } else {
    format = { type: 'iso8601' }
  }
  update('col_type', { kind: 'datetime', format })
}

function setDatetimePattern(pattern: string) {
  update('col_type', { kind: 'datetime', format: { type: 'custom', pattern } })
}

function setDefaultValue(raw: string) {
  if (raw === '') {
    update('default_value', null)
    return
  }
  try {
    const parsed = JSON.parse(raw)
    update('default_value', parsed as object)
  } catch {
    update('default_value', raw as unknown as object)
  }
}

const defaultValueText = computed(() => {
  const v = props.modelValue.default_value
  if (v === null || v === undefined) return ''
  if (typeof v === 'string') return v
  return JSON.stringify(v)
})

const colTypeKinds = ['string', 'integer', 'float', 'boolean', 'datetime']
const datetimeTypes = [
  { title: 'ISO 8601', value: 'iso8601' },
  { title: 'Unix timestamp', value: 'unix' },
  { title: 'Custom pattern', value: 'custom' },
]
</script>

<template>
  <v-card variant="outlined" class="column-row pa-3 mb-2">
    <div class="d-flex align-start ga-2">
      <v-icon class="drag-handle mt-3" icon="mdi-drag-vertical" />
      <div class="flex-grow-1">
        <div class="d-flex align-center mb-2">
          <span class="text-caption text-medium-emphasis">Column {{ index + 1 }}</span>
          <v-spacer />
          <v-btn
            size="small"
            variant="text"
            color="error"
            icon="mdi-delete"
            title="Remove column"
            @click="emit('remove')"
          />
        </div>

        <div class="d-flex ga-3 flex-wrap">
          <v-text-field
            :model-value="modelValue.name"
            label="Name"
            variant="outlined"
            density="compact"
            class="flex-grow-1"
            style="min-width: 180px"
            :rules="[(v: string) => !!v || 'Name is required']"
            required
            @update:model-value="update('name', $event)"
          />
          <v-text-field
            :model-value="modelValue.canonical ?? ''"
            label="Canonical"
            variant="outlined"
            density="compact"
            class="flex-grow-1"
            style="min-width: 180px"
            @update:model-value="update('canonical', $event || null)"
          />
        </div>

        <div class="d-flex ga-3 flex-wrap mt-2">
          <v-select
            :model-value="colTypeKind"
            :items="colTypeKinds"
            label="Type"
            variant="outlined"
            density="compact"
            style="min-width: 150px"
            class="flex-grow-0"
            @update:model-value="setColTypeKind($event)"
          />
          <v-select
            v-if="colTypeKind === 'datetime'"
            :model-value="datetimeType"
            :items="datetimeTypes"
            label="Datetime format"
            variant="outlined"
            density="compact"
            style="min-width: 200px"
            class="flex-grow-0"
            @update:model-value="setDatetimeType($event)"
          />
          <v-text-field
            v-if="colTypeKind === 'datetime' && datetimeType === 'custom'"
            :model-value="datetimePattern"
            label="Pattern (strftime)"
            variant="outlined"
            density="compact"
            placeholder="%Y-%m-%d"
            style="min-width: 180px"
            class="flex-grow-1"
            @update:model-value="setDatetimePattern($event)"
          />
          <v-text-field
            :model-value="defaultValueText"
            label="Default value (JSON)"
            variant="outlined"
            density="compact"
            placeholder='"text" / 42 / true / null'
            style="min-width: 180px"
            class="flex-grow-1"
            @update:model-value="setDefaultValue($event)"
          />
          <v-checkbox
            :model-value="modelValue.extra ?? false"
            label="Extra (synthesized)"
            density="compact"
            hide-details
            @update:model-value="update('extra', $event ?? false)"
          />
        </div>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.drag-handle {
  cursor: grab;
}
.column-row.sortable-ghost {
  opacity: 0.5;
}
</style>
