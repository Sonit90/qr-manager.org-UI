<script setup lang="ts">
import { ref } from 'vue'
import { type FileInput, FilterType } from '@/modules/files/fileTypes.ts'
import FileComponent from '@/modules/files/FileComponent.vue'

const files = ref<FileInput[]>([
  {
    id: '123',
    name: 'original_prices.csv',
    columns: [
      {
        name: 'Price Original',

        transformations: [],
        mapInformation: null,
      },
      {
        name: 'Product ID',
        transformations: [],
        mapInformation: null,
      },
      {
        name: 'Date',
        transformations: [],
        mapInformation: null,
      },
    ],
    filters: [
      {
        type: FilterType.Number,
        sourceIndex: 0,
        operator: '>',
        value: 100,
      },
    ],
  },
  {
    id: '1234',
    name: 'products.csv ',
    columns: [
      {
        name: 'Price',

        transformations: [],
        mapInformation: null,
      },
      {
        name: 'Product ID',
        transformations: [],
        mapInformation: null,
      },
      {
        name: 'Date',
        transformations: [],
        mapInformation: null,
      },
    ],
    filters: [
      {
        type: FilterType.Number,
        sourceIndex: 0,
        operator: '>',
        value: 100,
      },
    ],
  },
])
</script>

<template>
  <div class="d-flex gap-2 flex-col">
    <div class="flex align-center">Input Files</div>
    <FileComponent
      v-for="file in files"
      :key="file.id"
      v-model:columns="file.columns"
      v-model:filters="file.filters"
      :name="file.name"
    />
  </div>
</template>
