<script setup lang="ts">
import OutputComponent from '@/modules/files/outputColumns/OutputComponent.vue'
import FilesComponent from '@/modules/files/FilesComponent.vue'
</script>

<template>
  <v-row class="d-flex pa-4">
    <v-col cols="6">
      <FilesComponent />
    </v-col>
    <v-col cols="6">
      <OutputComponent />
    </v-col>
  </v-row>
</template>
