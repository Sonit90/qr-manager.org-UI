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
    <v-icon color="success" size="64" class="mb-4"> mdi-check-circle </v-icon>
    <v-card-title class="justify-center text-success">
      Account Activated Successfully!
    </v-card-title>
    <v-card-text class="text-center">
      Your account has been successfully activated. You can now sign in and start using our
      platform.
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
