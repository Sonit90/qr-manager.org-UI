<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import GenericState from '@/components/GenericState.vue'

const route = useRoute()
const qrId = computed(() => (route.query.qr_id as string | undefined) ?? '')
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-4 pa-sm-6" elevation="8" rounded="lg">
          <GenericState
            state="warning"
            title="QR Code Disabled"
            subtitle="This QR code has been disabled by the owner."
          />
          <div v-if="qrId" class="text-caption text-center text-medium-emphasis mt-2">
            QR ID: {{ qrId }}
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>
