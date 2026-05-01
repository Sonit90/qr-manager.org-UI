<script setup lang="ts">
import { computed } from 'vue'
import type {
  TypeFilterItemV1,
  TypeOutputColumnV1,
} from '@/api/__generated__/v1/data-contracts.ts'
import { TypeStepScopeV1 } from '@/api/__generated__/v1/data-contracts.ts'
import {
  type ComparisonOp,
  type Expr,
  FILTER_COMPARISON_OPS,
  FILTER_OP_LABELS,
  defaultLiteralExprForColType,
  getColKind,
  makeFilterCondition,
  readFilterCondition,
} from '@/modules/admin/formats/types.ts'

const props = defineProps<{
  modelValue: TypeFilterItemV1
  index: number
  columns: TypeOutputColumnV1[]
}>()

const emit = defineEmits<{
  'update:modelValue': [item: TypeFilterItemV1]
  remove: []
}>()

const condition = computed(() => {
  const parsed = readFilterCondition(props.modelValue.expr as Expr)
  if (parsed) return parsed
  const firstField = props.columns[0]?.name ?? ''
  const col = props.columns.find((c) => c.name === firstField)
  return {
    field: firstField,
    op: '==' as ComparisonOp,
    valueExpr: defaultLiteralExprForColType(col?.col_type),
  }
})

const fieldItems = computed(() =>
  props.columns.map((c) => c.name).filter((n) => n.length > 0),
)

const opItems = FILTER_COMPARISON_OPS.map((op) => ({
  title: `${op} (${FILTER_OP_LABELS[op]})`,
  value: op,
}))

const selectedCol = computed(() =>
  props.columns.find((c) => c.name === condition.value.field),
)

const colKind = computed(() => getColKind(selectedCol.value?.col_type))

function emitCondition(field: string, op: ComparisonOp, valueExpr: Expr) {
  emit('update:modelValue', {
    scope: props.modelValue.scope ?? TypeStepScopeV1.EnumFile,
    expr: makeFilterCondition(field, op, valueExpr) as unknown as object,
  })
}

function setField(field: string) {
  const col = props.columns.find((c) => c.name === field)
  const valueExpr = defaultLiteralExprForColType(col?.col_type)
  emitCondition(field, condition.value.op, valueExpr)
}

function setOp(op: ComparisonOp) {
  emitCondition(condition.value.field, op, condition.value.valueExpr)
}

const valueStr = computed(() => {
  const v = condition.value.valueExpr
  if (v.op === 'str') return v.value
  return ''
})

const valueNum = computed(() => {
  const v = condition.value.valueExpr
  return v.op === 'num' ? v.value : null
})

const valueBool = computed(() => {
  const v = condition.value.valueExpr
  return v.op === 'bool' ? v.value : false
})

function setStringValue(s: string) {
  emitCondition(condition.value.field, condition.value.op, { op: 'str', value: s })
}

function setIntegerValue(s: string) {
  const n = Number.parseInt(s, 10)
  if (Number.isFinite(n)) {
    emitCondition(condition.value.field, condition.value.op, { op: 'num', value: n })
  }
}

function setFloatValue(s: string) {
  const n = Number.parseFloat(s)
  if (Number.isFinite(n)) {
    emitCondition(condition.value.field, condition.value.op, { op: 'num', value: n })
  }
}

function setBoolValue(b: boolean | null) {
  emitCondition(condition.value.field, condition.value.op, { op: 'bool', value: b ?? false })
}
</script>

<template>
  <v-card variant="flat" class="filter-item pa-2 mb-2">
    <div class="d-flex align-center ga-2 flex-wrap">
      <v-icon class="item-drag-handle" icon="mdi-drag-vertical" />
      <span class="text-caption text-medium-emphasis">#{{ index + 1 }}</span>

      <v-select
        :model-value="condition.field"
        :items="fieldItems"
        label="Column"
        variant="outlined"
        density="compact"
        hide-details
        style="min-width: 180px"
        class="flex-grow-1"
        @update:model-value="setField($event)"
      />

      <v-select
        :model-value="condition.op"
        :items="opItems"
        label="Condition"
        variant="outlined"
        density="compact"
        hide-details
        style="min-width: 200px"
        class="flex-grow-0"
        @update:model-value="setOp($event as ComparisonOp)"
      />

      <v-text-field
        v-if="colKind === 'string' || colKind === 'datetime'"
        :model-value="valueStr"
        label="Value"
        variant="outlined"
        density="compact"
        hide-details
        style="min-width: 180px"
        class="flex-grow-1"
        @update:model-value="setStringValue($event)"
      />
      <v-text-field
        v-else-if="colKind === 'integer'"
        :model-value="valueNum ?? ''"
        type="number"
        step="1"
        label="Value"
        variant="outlined"
        density="compact"
        hide-details
        style="min-width: 140px"
        class="flex-grow-1"
        @update:model-value="setIntegerValue($event)"
      />
      <v-text-field
        v-else-if="colKind === 'float'"
        :model-value="valueNum ?? ''"
        type="number"
        step="any"
        label="Value"
        variant="outlined"
        density="compact"
        hide-details
        style="min-width: 140px"
        class="flex-grow-1"
        @update:model-value="setFloatValue($event)"
      />
      <v-switch
        v-else-if="colKind === 'boolean'"
        :model-value="valueBool"
        :label="valueBool ? 'true' : 'false'"
        density="compact"
        color="primary"
        hide-details
        inset
        @update:model-value="setBoolValue($event)"
      />

      <v-btn
        size="small"
        variant="text"
        color="error"
        icon="mdi-close"
        title="Remove filter"
        @click="emit('remove')"
      />
    </div>
  </v-card>
</template>

<style scoped>
.item-drag-handle {
  cursor: grab;
}
.filter-item {
  background: rgba(var(--v-theme-on-surface), 0.04);
}
.filter-item.sortable-ghost {
  opacity: 0.5;
}
</style>
