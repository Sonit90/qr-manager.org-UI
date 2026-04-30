<script setup lang="ts">
import type { TypeFileV1 } from '@/api/__generated__/v1/data-contracts.ts'

defineProps<{
  files: TypeFileV1[]
}>()
const model = defineModel<TypeFileV1[]>({ default: [] })
</script>

<template>
  <v-select
    v-model="model"
    clearable
    return-object
    label="Select"
    :items="files"
    item-title="original_name"
    multiple
  />
</template>
