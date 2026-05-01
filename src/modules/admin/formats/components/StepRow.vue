<script setup lang="ts">
import { computed } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import type {
  TypeOutputColumnV1,
  TypeOutputStepV1,
  TypeFilterItemV1,
  TypeTransformItemV1,
} from '@/api/__generated__/v1/data-contracts.ts'
import { TypeStepScopeV1 } from '@/api/__generated__/v1/data-contracts.ts'
import FilterItemRow from '@/modules/admin/formats/components/FilterItemRow.vue'
import TransformItemRow from '@/modules/admin/formats/components/TransformItemRow.vue'
import {
  defaultLiteralExprForColType,
  makeFilterCondition,
} from '@/modules/admin/formats/types.ts'

const props = defineProps<{
  modelValue: TypeOutputStepV1
  index: number
  columns: TypeOutputColumnV1[]
}>()

const emit = defineEmits<{
  'update:modelValue': [step: TypeOutputStepV1]
  remove: []
}>()

const fieldNames = computed(() => props.columns.map((c) => c.name).filter((n) => n.length > 0))

function firstField(): string {
  return fieldNames.value[0] ?? ''
}

function buildFilterItem(): TypeFilterItemV1 {
  const field = firstField()
  const col = props.columns.find((c) => c.name === field)
  const valueExpr = defaultLiteralExprForColType(col?.col_type)
  return {
    scope: TypeStepScopeV1.EnumFile,
    expr: makeFilterCondition(field, '==', valueExpr) as unknown as object,
  }
}

function buildTransformItem(): TypeTransformItemV1 {
  const field = firstField()
  const col = props.columns.find((c) => c.name === field)
  const expr = defaultLiteralExprForColType(col?.col_type)
  return { field, expr: expr as unknown as object }
}

function addFilterItem() {
  if (props.modelValue.kind !== 'filters') return
  const items = [...props.modelValue.items, buildFilterItem()]
  emit('update:modelValue', { kind: 'filters', items })
}

function addTransformItem() {
  if (props.modelValue.kind !== 'transforms') return
  const items = [...props.modelValue.items, buildTransformItem()]
  emit('update:modelValue', { kind: 'transforms', items })
}

function updateFilterItem(idx: number, item: TypeFilterItemV1) {
  if (props.modelValue.kind !== 'filters') return
  const items = [...props.modelValue.items]
  items[idx] = item
  emit('update:modelValue', { kind: 'filters', items })
}

function updateTransformItem(idx: number, item: TypeTransformItemV1) {
  if (props.modelValue.kind !== 'transforms') return
  const items = [...props.modelValue.items]
  items[idx] = item
  emit('update:modelValue', { kind: 'transforms', items })
}

function removeFilterItem(idx: number) {
  if (props.modelValue.kind !== 'filters') return
  const items = [...props.modelValue.items]
  items.splice(idx, 1)
  emit('update:modelValue', { kind: 'filters', items })
}

function removeTransformItem(idx: number) {
  if (props.modelValue.kind !== 'transforms') return
  const items = [...props.modelValue.items]
  items.splice(idx, 1)
  emit('update:modelValue', { kind: 'transforms', items })
}

function reorderFilters(items: TypeFilterItemV1[]) {
  emit('update:modelValue', { kind: 'filters', items })
}

function reorderTransforms(items: TypeTransformItemV1[]) {
  emit('update:modelValue', { kind: 'transforms', items })
}

const headerLabel = computed(() => {
  const count = props.modelValue.items.length
  const word = props.modelValue.kind === 'filters' ? 'Filters' : 'Transforms'
  return `${word} (${count})`
})
</script>

<template>
  <v-card variant="outlined" class="step-row pa-3 mb-3">
    <div class="d-flex align-start ga-2">
      <v-icon class="step-drag-handle mt-3" icon="mdi-drag-vertical" />
      <div class="flex-grow-1">
        <div class="d-flex align-center mb-3">
          <v-chip color="primary" size="small" variant="flat" class="mr-2">
            Step {{ index + 1 }}
          </v-chip>
          <span class="text-subtitle-2">{{ headerLabel }}</span>
          <v-spacer />
          <v-btn
            size="small"
            variant="text"
            color="error"
            icon="mdi-delete"
            title="Remove step"
            @click="emit('remove')"
          />
        </div>

        <template v-if="modelValue.kind === 'filters'">
          <VueDraggable
            :model-value="modelValue.items"
            handle=".item-drag-handle"
            ghost-class="sortable-ghost"
            @update:model-value="reorderFilters"
          >
            <FilterItemRow
              v-for="(item, idx) in modelValue.items"
              :key="idx"
              :model-value="item"
              :index="idx"
              :columns="columns"
              @update:model-value="updateFilterItem(idx, $event)"
              @remove="removeFilterItem(idx)"
            />
          </VueDraggable>
          <v-btn
            class="mt-2"
            size="small"
            variant="tonal"
            prepend-icon="mdi-plus"
            text="Add filter"
            @click="addFilterItem()"
          />
        </template>

        <template v-else-if="modelValue.kind === 'transforms'">
          <VueDraggable
            :model-value="modelValue.items"
            handle=".item-drag-handle"
            ghost-class="sortable-ghost"
            @update:model-value="reorderTransforms"
          >
            <TransformItemRow
              v-for="(item, idx) in modelValue.items"
              :key="idx"
              :model-value="item"
              :index="idx"
              :columns="columns"
              @update:model-value="updateTransformItem(idx, $event)"
              @remove="removeTransformItem(idx)"
            />
          </VueDraggable>
          <v-btn
            class="mt-2"
            size="small"
            variant="tonal"
            prepend-icon="mdi-plus"
            text="Add transform"
            @click="addTransformItem()"
          />
        </template>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.step-drag-handle {
  cursor: grab;
}
.step-row.sortable-ghost {
  opacity: 0.5;
}
</style>
