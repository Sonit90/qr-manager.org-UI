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
  emit('update:modelValue', {
    ...props.modelValue,
    col_type: next,
    default_value: null,
  })
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

const defaultStr = computed(() =>
  typeof props.modelValue.default_value === 'string' ? props.modelValue.default_value : '',
)

const defaultNum = computed(() => {
  const v = props.modelValue.default_value
  return typeof v === 'number' ? v : null
})

const defaultBool = computed(() => {
  const v = props.modelValue.default_value
  return typeof v === 'boolean' ? v : false
})

function setStringDefault(v: string) {
  update('default_value', (v === '' ? null : v) as unknown as TypeOutputColumnV1['default_value'])
}

function setIntegerDefault(v: string) {
  if (v === '') {
    update('default_value', null)
    return
  }
  const n = Number.parseInt(v, 10)
  if (Number.isFinite(n)) {
    update('default_value', n as unknown as TypeOutputColumnV1['default_value'])
  }
}

function setFloatDefault(v: string) {
  if (v === '') {
    update('default_value', null)
    return
  }
  const n = Number.parseFloat(v)
  if (Number.isFinite(n)) {
    update('default_value', n as unknown as TypeOutputColumnV1['default_value'])
  }
}

function setBoolDefault(v: boolean | null) {
  update('default_value', (v ?? false) as unknown as TypeOutputColumnV1['default_value'])
}

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
        </div>

        <div class="d-flex ga-3 flex-wrap mt-2">
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
            v-if="colTypeKind === 'string'"
            :model-value="defaultStr"
            label="Default value"
            variant="outlined"
            density="compact"
            style="min-width: 180px"
            class="flex-grow-1"
            @update:model-value="setStringDefault($event)"
          />
          <v-text-field
            v-if="colTypeKind === 'integer'"
            :model-value="defaultNum ?? ''"
            type="number"
            step="1"
            label="Default value"
            variant="outlined"
            density="compact"
            style="min-width: 180px"
            class="flex-grow-1"
            @update:model-value="setIntegerDefault($event)"
          />
          <v-text-field
            v-if="colTypeKind === 'float'"
            :model-value="defaultNum ?? ''"
            type="number"
            step="any"
            label="Default value"
            variant="outlined"
            density="compact"
            style="min-width: 180px"
            class="flex-grow-1"
            @update:model-value="setFloatDefault($event)"
          />
          <v-switch
            v-if="colTypeKind === 'boolean'"
            :model-value="defaultBool"
            label="Default value"
            color="primary"
            density="compact"
            hide-details
            inset
            @update:model-value="setBoolDefault($event)"
          />
          <v-text-field
            v-if="colTypeKind === 'datetime'"
            :model-value="defaultStr"
            label="Default value"
            placeholder="2026-01-01T00:00:00Z"
            variant="outlined"
            density="compact"
            style="min-width: 200px"
            class="flex-grow-1"
            @update:model-value="setStringDefault($event)"
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
