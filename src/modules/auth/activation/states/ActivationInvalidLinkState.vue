<script setup lang="ts">
defineProps({
  isResending: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits({
  'resend-activation': null,
})
</script>
<template>
  <div class="text-center">
    <v-icon color="warning" size="64" class="mb-4"> mdi-link-off </v-icon>
    <v-card-title class="justify-center text-warning"> Invalid Activation Link </v-card-title>
    <v-card-text class="text-center">
      The activation link is invalid or has expired. Please request a new activation email.
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn
        color="primary"
        variant="outlined"
        prepend-icon="mdi-email-resend"
        :loading="isResending"
        @click="emit('resend-activation')"
      >
        Resend Activation Email
      </v-btn>
    </v-card-actions>
  </div>
</template>
