<script setup lang="ts">
import { useOutputColumns } from '@/modules/files/outputColumns/useOutputColumns.ts'

const { outputColumns } = useOutputColumns()

function addColumn() {
  outputColumns.value.push({ name: '' })
}
function removeColumn(index: number) {
  outputColumns.value.splice(index, 1)
}
</script>

<template>
  <v-card-title>
    <div class="d-flex">
      Output Columns
      <v-btn class="ml-auto" density="compact" icon="mdi-plus" @click="addColumn()" />
    </div>
  </v-card-title>
  <div
    v-for="(col, index) in outputColumns"
    :key="index"
    class="d-flex ga-2 px-4 py-2 align-center"
  >
    <v-text-field v-model="col.name" hide-details />
    <v-btn density="compact" variant="plain" icon="mdi-trash-can" @click="removeColumn(index)" />
  </div>
  <v-card-actions>
    <v-btn :disabled="outputColumns.length === 0" color="primary">Convert</v-btn>
    <v-btn>Cancel</v-btn>
  </v-card-actions>
</template>
