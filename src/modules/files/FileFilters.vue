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
      v-model="filter.sourceIndex"
      density="compact"
      class="w-30"
      hide-details
      :items="columnOptions"
    />
    <v-select
      v-model="filter.type"
      class="w-15"
      density="compact"
      :items="Object.values(FilterType)"
      hide-details
      @update:model-value="onTypeChange($event, index)"
    />
    <v-select
      v-model="filter.operator"
      class="w-10"
      density="compact"
      hide-details
      :items="filterOperators[filter.type]"
    />
    <v-text-field
      v-model="filter.value"
      density="compact"
      :type="textFieldType(filter.type)"
      class="w-10"
      hide-details
      label="Value"
    />
    <v-btn class="ml-auto" density="compact" icon="mdi-plus" @click="addFilter()" />
  </div>
</template>
