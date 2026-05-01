<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type { TypeOutputColumnV1 } from '@/api/__generated__/v1/data-contracts.ts'
import ColumnRow from '@/modules/admin/formats/components/ColumnRow.vue'

const props = defineProps<{
  modelValue: TypeOutputColumnV1[]
}>()

const emit = defineEmits<{
  'update:modelValue': [cols: TypeOutputColumnV1[]]
}>()

function newColumn(): TypeOutputColumnV1 {
  return {
    name: '',
    canonical: null,
    extra: false,
    col_type: { kind: 'string' },
    default_value: null,
  }
}

function addColumn() {
  emit('update:modelValue', [...props.modelValue, newColumn()])
}

function updateAt(index: number, col: TypeOutputColumnV1) {
  const next = [...props.modelValue]
  next[index] = col
  emit('update:modelValue', next)
}

function removeAt(index: number) {
  const next = [...props.modelValue]
  next.splice(index, 1)
  emit('update:modelValue', next)
}

function onListUpdate(list: TypeOutputColumnV1[]) {
  emit('update:modelValue', list)
}
</script>

<template>
  <div>
    <VueDraggable
      :model-value="modelValue"
      handle=".drag-handle"
      ghost-class="sortable-ghost"
      @update:model-value="onListUpdate"
    >
      <ColumnRow
        v-for="(col, idx) in modelValue"
        :key="idx"
        :model-value="col"
        :index="idx"
        @update:model-value="updateAt(idx, $event)"
        @remove="removeAt(idx)"
      />
    </VueDraggable>
    <div v-if="modelValue.length === 0" class="text-medium-emphasis text-center pa-4">
      No columns yet. Add at least one.
    </div>
    <v-btn
      class="mt-2"
      color="primary"
      variant="tonal"
      prepend-icon="mdi-plus"
      text="Add column"
      @click="addColumn()"
    />
  </div>
</template>
