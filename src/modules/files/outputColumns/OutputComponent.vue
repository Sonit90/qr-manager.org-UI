<script setup lang="ts">
import { reactive } from 'vue'
import OutputColumns from '@/modules/files/outputColumns/OutputColumns.vue'
interface OutputMetaInformation {
  name: string
  format: 'csv' | 'xls' | 'xlsx'
}

const formatOptions = ['csv', 'xls', 'xlsx']

const outputMetaInformation: OutputMetaInformation = reactive({
  name: 'Output',
  format: 'csv',
})
</script>

<template>
  <v-card>
    <v-card-title> Output Configuration </v-card-title>
    <div class="d-flex ga-2 px-2">
      <v-text-field v-model="outputMetaInformation.name" label="Name" required />
      <v-select v-model="outputMetaInformation.format" label="Format" :items="formatOptions" />
    </div>
    <OutputColumns />
  </v-card>
</template>
