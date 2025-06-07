<script setup lang="ts">
import { computed, ref } from 'vue'
import type { FileInput } from '@/modules/files/fileTypes.ts'
import { useOutputColumns } from '@/modules/files/useOutputColumns.ts'
import FileFilters from '@/modules/files/FileFilters.vue'

defineProps<{
  name: string
}>()
const modelColumns = defineModel<FileInput['columns']>('columns')
const modelFilters = defineModel<FileInput['filters']>('filters')

const { availableColumns, outputColumns } = useOutputColumns(modelColumns)

const mapOptions = computed(() => {
  return [{ name: 'No mapping' }, ...availableColumns.value]
})

function onSelect(columnIndex: number, targetName: string) {
  if (!modelColumns.value || !modelColumns.value[columnIndex]) {
    return
  }
  const targetIndex = outputColumns.value.findIndex((col) => col.name === targetName)
  modelColumns.value[columnIndex].mapInformation = { targetIndex, targetName }
}

const isExpanded = ref(false)
</script>

<template>
  <v-card v-if="modelColumns && modelFilters" class="pa-2 d-flex gap-2 flex-col">
    <v-card-title class="d-flex px-0 gap-2">
      <span>
        {{ name }}
      </span>
      <v-chip v-if="modelFilters.length">
        <v-icon icon="mdi-filter-outline" size="sm" />
        {{ modelFilters.length }} filters
      </v-chip>
      <v-btn
        class="ml-auto"
        :class="{ 'rotate-90': isExpanded }"
        icon="mdi-chevron-right"
        density="compact"
        @click="isExpanded = !isExpanded"
      ></v-btn
    ></v-card-title>
    <div class="flex align-center gap-2" v-for="(col, index) in modelColumns" :key="col.name">
      {{ col.name }}
      <v-select
        class="ml-auto max-w-xs"
        label="Map to"
        @update:modelValue="onSelect(index, $event)"
        hide-details
        :items="mapOptions"
        item-title="name"
        item-value="name"
      />
    </div>
    <FileFilters v-if="isExpanded" v-model="modelFilters" :columns="modelColumns" />
  </v-card>
</template>
