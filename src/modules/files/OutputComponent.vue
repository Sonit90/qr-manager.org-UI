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
  <div class="pa-2 flex flex-col gap-2">
    Output Configuration
    <v-card>
      <v-card-title> Output </v-card-title>
      <div class="d-flex gap-2 px-2">
        <v-text-field v-model="outputMetaInformation.name" label="Name" required></v-text-field>
        <v-select label="Format" v-model="outputMetaInformation.format" :items="formatOptions" />
      </div>
    </v-card>
    <OutputColumns />
  </div>
</template>
