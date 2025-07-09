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

const isLoading = ref(false)
</script>

<template>
  <div v-if="isLoading" class="d-flex justify-center align-center" style="height: 200px">
    <v-progress-circular indeterminate color="primary" size="48" />
  </div>
  <v-card v-else class="files-widget" max-width="400" elevation="2">
    <v-card-title class="d-flex align-center">
      <v-avatar color="primary" class="me-3">
        <v-icon color="white">mdi-file-multiple</v-icon>
      </v-avatar>
      <div>
        <div class="text-h6">Input Files</div>
        <div class="text-caption text-medium-emphasis">{{ files.length }} files available</div>
      </div>
    </v-card-title>

    <v-card-text class="pa-0">
      <v-list density="compact" class="pa-0">
        <FileComponent
          v-for="file in files"
          :key="file.id"
          v-model:columns="file.columns"
          v-model:filters="file.filters"
          :name="file.name"
        />
      </v-list>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.files-widget {
  border-radius: 12px;
}
</style>
