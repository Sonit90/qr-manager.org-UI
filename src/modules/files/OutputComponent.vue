<script setup lang="ts">
import { reactive } from 'vue'
import OutputColumns from '@/modules/files/OutputColumns.vue'
interface OutputMetaInformation {
  name: string
  format: 'csv' | 'xls' | 'xlsx'
}

const formatOptions = ['csv', 'xls', 'xlsx']

const outputMetaInformation: OutputMetaInformation = reactive({
  name: 'TestName',
  format: 'csv',
})
</script>

<template>
  <div class="pa-2 d-flex flex-column ga-2">
    Output Configuration
    <v-card>
      <v-card-title> Output </v-card-title>
      <div class="d-flex ga-2 px-2">
        <v-text-field v-model="outputMetaInformation.name" label="Name" required></v-text-field>
        <v-select v-model="outputMetaInformation.format" label="Format" :items="formatOptions" />
      </div>
    </v-card>
    <OutputColumns />
  </div>
</template>
