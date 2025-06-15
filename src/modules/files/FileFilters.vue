<script setup lang="ts">
import { type FileInput, FilterType } from '@/modules/files/fileTypes.ts'
import { computed } from 'vue'
import { filterOperators } from '@/modules/files/filterConstants.ts'

const props = defineProps<{
  columns: FileInput['columns']
}>()
const model = defineModel<FileInput['filters']>({ default: [] })

const columnOptions = computed(() =>
  props.columns.map((col, index) => ({ title: col.name, value: index })),
)

function onTypeChange(newType: FilterType, filterIndex: number) {
  model.value[filterIndex].operator = filterOperators[newType][0]
  model.value[filterIndex].value = newType === FilterType.Number ? 0 : ''
}

function addFilter() {
  model.value.push({ type: FilterType.Number, sourceIndex: 0, operator: '>', value: 0 })
}

function textFieldType(filterType: FilterType) {
  return filterType === FilterType.Number ? 'number' : 'text'
}
</script>

<template>
  <div v-for="(filter, index) in model" :key="index" class="d-flex ga-2 align-center">
    <v-select
      density="compact"
      class="w-30"
      hide-details
      :items="columnOptions"
      v-model="filter.sourceIndex"
    />
    <v-select
      class="w-15"
      density="compact"
      :items="Object.values(FilterType)"
      hide-details
      v-model="filter.type"
      @update:modelValue="onTypeChange($event, index)"
    />
    <v-select
      class="w-10"
      density="compact"
      hide-details
      :items="filterOperators[filter.type]"
      v-model="filter.operator"
    />
    <v-text-field
      density="compact"
      :type="textFieldType(filter.type)"
      class="w-10"
      hide-details
      label="Value"
      v-model="filter.value"
    />
    <v-btn class="ml-auto" density="compact" icon="mdi-plus" @click="addFilter()" />
  </div>
</template>
