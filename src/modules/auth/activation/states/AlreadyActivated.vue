<script setup lang="ts">
withDefaults(
  defineProps<{
    loginUrl?: string
  }>(),
  {
    loginUrl: '/login',
  },
)
</script>

<template>
  <div class="text-center">
    <v-icon color="info" size="64" class="mb-4"> mdi-information </v-icon>
    <v-card-title class="justify-center text-info"> Account Already Activated </v-card-title>
    <v-card-text class="text-center">
      This account has already been activated. You can sign in using your credentials.
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn
        color="primary"
        variant="elevated"
        size="large"
        prepend-icon="mdi-login"
        :to="{ path: loginUrl }"
      >
        Sign In
      </v-btn>
    </v-card-actions>
  </div>
</template>
