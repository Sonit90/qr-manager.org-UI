<script setup lang="ts">
import OutputComponent from '@/modules/files/OutputComponent.vue'
import FilesComponent from '@/modules/files/FilesComponent.vue'
</script>

<template>
  <div class="flex p-4">
    <FilesComponent class="p-2 w-50 grow" />
    <OutputComponent class="p-2 w-50 grow" />
  </div>
</template>
