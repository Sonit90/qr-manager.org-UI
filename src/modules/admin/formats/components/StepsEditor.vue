<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type {
  TypeOutputColumnV1,
  TypeOutputStepV1,
  TypeFilterItemV1,
  TypeTransformItemV1,
} from '@/api/__generated__/v1/data-contracts.ts'
import { TypeStepScopeV1 } from '@/api/__generated__/v1/data-contracts.ts'
import StepRow from '@/modules/admin/formats/components/StepRow.vue'
import {
  defaultLiteralExprForColType,
  makeFilterCondition,
} from '@/modules/admin/formats/types.ts'

const props = defineProps<{
  modelValue: TypeOutputStepV1[]
  columns: TypeOutputColumnV1[]
}>()

const emit = defineEmits<{
  'update:modelValue': [steps: TypeOutputStepV1[]]
}>()

function firstFieldName(): string {
  return props.columns.map((c) => c.name).find((n) => n.length > 0) ?? ''
}

function newFilterItem(): TypeFilterItemV1 {
  const field = firstFieldName()
  const firstCol = props.columns.find((c) => c.name === field)
  const valueExpr = defaultLiteralExprForColType(firstCol?.col_type)
  return {
    scope: TypeStepScopeV1.EnumFile,
    expr: makeFilterCondition(field, '==', valueExpr) as unknown as object,
  }
}

function newTransformItem(): TypeTransformItemV1 {
  const field = firstFieldName()
  const firstCol = props.columns.find((c) => c.name === field)
  const expr = defaultLiteralExprForColType(firstCol?.col_type)
  return { field, expr: expr as unknown as object }
}

function addFiltersStep() {
  const next: TypeOutputStepV1 = { kind: 'filters', items: [newFilterItem()] }
  emit('update:modelValue', [...props.modelValue, next])
}

function addTransformsStep() {
  const next: TypeOutputStepV1 = { kind: 'transforms', items: [newTransformItem()] }
  emit('update:modelValue', [...props.modelValue, next])
}

function updateAt(index: number, step: TypeOutputStepV1) {
  const next = [...props.modelValue]
  next[index] = step
  emit('update:modelValue', next)
}

function removeAt(index: number) {
  const next = [...props.modelValue]
  next.splice(index, 1)
  emit('update:modelValue', next)
}

function onListUpdate(list: TypeOutputStepV1[]) {
  emit('update:modelValue', list)
}
</script>

<template>
  <div>
    <v-alert
      v-if="modelValue.length > 0"
      type="info"
      variant="tonal"
      density="compact"
      class="mb-3"
      icon="mdi-sort-numeric-ascending"
    >
      Steps execute in order. Items inside a step also apply in order.
    </v-alert>

    <VueDraggable
      :model-value="modelValue"
      handle=".step-drag-handle"
      ghost-class="sortable-ghost"
      @update:model-value="onListUpdate"
    >
      <StepRow
        v-for="(step, idx) in modelValue"
        :key="idx"
        :model-value="step"
        :index="idx"
        :columns="columns"
        @update:model-value="updateAt(idx, $event)"
        @remove="removeAt(idx)"
      />
    </VueDraggable>

    <div v-if="modelValue.length === 0" class="text-medium-emphasis text-center pa-4">
      No steps. Output uses raw merged data.
    </div>

    <v-menu>
      <template #activator="{ props: menuProps }">
        <v-btn
          v-bind="menuProps"
          color="primary"
          variant="tonal"
          prepend-icon="mdi-plus"
          text="Add step"
        />
      </template>
      <v-list>
        <v-list-item
          prepend-icon="mdi-filter"
          title="Filters"
          @click="addFiltersStep()"
        />
        <v-list-item
          prepend-icon="mdi-function-variant"
          title="Transforms"
          @click="addTransformsStep()"
        />
      </v-list>
    </v-menu>
  </div>
</template>
