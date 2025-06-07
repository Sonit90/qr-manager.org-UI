<script setup lang="ts">
import { reactive, ref } from 'vue'
interface OutputMetaInformation {
  name: string
  format: 'csv' | 'xls' | 'xlsx'
}

const outputMetaInformation: OutputMetaInformation = reactive({
  name: '',
  format: 'csv',
})
const output = ref([])
</script>

<template>
  <div>
    {{ outputMetaInformation }}
    {{ output }}
  </div>
</template>

<style scoped></style>
