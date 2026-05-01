<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type {
  TypeOutputColumnV1,
  TypeOutputStepV1,
} from '@/api/__generated__/v1/data-contracts.ts'
import StepRow from '@/modules/admin/formats/components/StepRow.vue'
import { makeDefaultExpr } from '@/modules/admin/formats/types.ts'

const props = defineProps<{
  modelValue: TypeOutputStepV1[]
  columns: TypeOutputColumnV1[]
}>()

const emit = defineEmits<{
  'update:modelValue': [steps: TypeOutputStepV1[]]
}>()

function newFilterStep(): TypeOutputStepV1 {
  return { kind: 'filter', scope: 'file', expr: makeDefaultExpr('bool') } as TypeOutputStepV1
}

function newTransformStep(): TypeOutputStepV1 {
  const firstField = props.columns
    .map((c) => c.canonical || c.name)
    .find((n) => n.length > 0) ?? ''
  return {
    kind: 'transform',
    field: firstField,
    expr: makeDefaultExpr('str'),
  } as TypeOutputStepV1
}

function addFilter() {
  emit('update:modelValue', [...props.modelValue, newFilterStep()])
}

function addTransform() {
  emit('update:modelValue', [...props.modelValue, newTransformStep()])
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
      Steps execute in the order shown. File-scoped filters always run before any global step.
    </v-alert>

    <VueDraggable
      :model-value="modelValue"
      handle=".drag-handle"
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

    <div class="d-flex ga-2 mt-2">
      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-filter-plus"
        text="Add filter"
        @click="addFilter()"
      />
      <v-btn
        color="primary"
        variant="tonal"
        prepend-icon="mdi-function-variant"
        text="Add transform"
        @click="addTransform()"
      />
    </div>
  </div>
</template>
