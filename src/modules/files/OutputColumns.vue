<script setup lang="ts">
import { useOutputColumns } from '@/modules/files/useOutputColumns.ts'

const { outputColumns } = useOutputColumns()

function addColumn() {
  outputColumns.value.push({ name: '' })
}
function removeColumn(index: number) {
  outputColumns.value.splice(index, 1)
}
</script>

<template>
  <v-card>
    <v-card-title>
      <div class="d-flex">
        Output Columns
        <v-btn class="ml-auto" density="compact" icon="mdi-plus" @click="addColumn()" />
      </div>
    </v-card-title>
    <div
      class="d-flex ga-2 px-4 py-2 align-center"
      v-for="(col, index) in outputColumns"
      :key="index"
    >
      <v-text-field hide-details v-model="col.name" />
      <v-btn density="compact" variant="plain" icon="mdi-trash-can" @click="removeColumn(index)" />
    </div>
  </v-card>
</template>

<style scoped></style>
