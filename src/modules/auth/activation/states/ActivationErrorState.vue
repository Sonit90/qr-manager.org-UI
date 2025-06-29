<script setup lang="ts">
withDefaults(
  defineProps<{
    homeUrl?: string
    errorMessage?: string
    isResending?: boolean
  }>(),
  {
    homeUrl: '/',
    errorMessage: 'An error occurred during activation.',
    isResending: false,
  },
)

const emit = defineEmits({
  'resend-activation': null,
})
</script>
<template>
  <div class="text-center">
    <v-icon color="error" size="64" class="mb-4"> mdi-alert-circle </v-icon>
    <v-card-title class="justify-center text-error"> Activation Failed </v-card-title>
    <v-card-text class="text-center">
      {{ errorMessage }}
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn
        color="primary"
        variant="outlined"
        prepend-icon="mdi-email-sync"
        :loading="isResending"
        @click="emit('resend-activation')"
      >
        Resend Activation Email
      </v-btn>
      <v-btn color="primary" variant="text" :to="{ path: homeUrl }" prepend-icon="mdi-home">
        Home Page
      </v-btn>
    </v-card-actions>
  </div>
</template>
