<script setup lang="ts">
import VersionProp from '@/components/version/VersionProp.vue'
import pkg from '../../../package.json'
const version = pkg.version
const environment = import.meta.env.MODE

const buildDate = __BUILD_DATE__
</script>

<template>
  <v-card class="pa-3" elevation="6">
    <v-row dense class="text-body-2">
      <VersionProp label="Version" :value="version" />
      <VersionProp label="Environment" :value="environment" />
      <VersionProp label="Built" :value="buildDate" />
    </v-row>
  </v-card>
</template>
