<script setup lang="ts">
import { ref } from 'vue'
import { type FileInput, FilterType } from '@/modules/files/fileTypes.ts'
import FileComponent from '@/modules/files/FileComponent.vue'
import { useFiles } from '@/modules/userFiles/composables/useFiles.ts'
import FileSelector from '@/modules/files/FileSelector.vue'

// const files = ref<FileInput[]>([
//   {
//     id: '123',
//     name: 'original_prices.csv',
//     columns: [
//       {
//         name: 'Price Original',
//         transformations: [],
//         mapInformation: null,
//       },
//       {
//         name: 'Product ID',
//         transformations: [],
//         mapInformation: null,
//       },
//       {
//         name: 'Date',
//         transformations: [],
//         mapInformation: null,
//       },
//     ],
//     filters: [
//       {
//         type: FilterType.Number,
//         sourceIndex: 0,
//         operator: '>',
//         value: 100,
//       },
//     ],
//   },
//   {
//     id: '1234',
//     name: 'products.csv ',
//     columns: [
//       {
//         name: 'Price',
//         transformations: [],
//         mapInformation: null,
//       },
//       {
//         name: 'Product ID',
//         transformations: [],
//         mapInformation: null,
//       },
//       {
//         name: 'Date',
//         transformations: [],
//         mapInformation: null,
//       },
//     ],
//     filters: [
//       {
//         type: FilterType.Number,
//         sourceIndex: 0,
//         operator: '>',
//         value: 100,
//       },
//     ],
//   },
// ])

const selectedFiles = ref([])

const { files, loading, fetchFiles } = useFiles()

fetchFiles()
</script>

<template>
  <v-card class="files-widget" elevation="2">
    <v-card-title class="d-flex align-center">
      <v-avatar color="primary" class="me-3">
        <v-icon color="white">mdi-file-multiple</v-icon>
      </v-avatar>
      <div>
        <div class="text-h6">Input Files</div>
        <div class="text-caption text-medium-emphasis">
          <template v-if="loading"> Loading files... </template>
          <template v-else> {{ files.length }} files available </template>
        </div>
      </div>
    </v-card-title>

    <v-card-text>
      <FileSelector v-model="selectedFiles" :files="files" />
      <v-list density="compact" class="pa-0">
        <!--        <FileComponent-->
        <!--          v-for="file in selectedFiles"-->
        <!--          :key="file.name"-->
        <!--          v-model:columns="file.columns"-->
        <!--          v-model:filters="file.filters"-->
        <!--          :name="file.name"-->
        <!--        />-->
      </v-list>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.files-widget {
  border-radius: 12px;
}
</style>
