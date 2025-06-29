<script setup lang="ts">
import type { TypeUserPublicV1 } from '@/api/__generated__/v1/data-contracts.ts'

defineProps<{
  loading: boolean
  user?: TypeUserPublicV1 | null
}>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    admin: 'error',
    moderator: 'warning',
    user: 'primary',
    guest: 'secondary',
  }
  return colors[role.toLowerCase()] || 'primary'
}
</script>
<template>
  <div v-if="loading" class="d-flex justify-center align-center" style="height: 200px">
    <v-progress-circular indeterminate color="primary" size="48" />
  </div>
  <v-card :loading="loading" v-if="user" class="user-info-widget" max-width="400" elevation="2">
    <v-card-title class="d-flex align-center">
      <v-avatar color="primary" class="me-3">
        <v-icon color="white">mdi-account</v-icon>
      </v-avatar>
      <div>
        <div class="text-h6">{{ user.full_name }}</div>
        <div class="text-caption text-medium-emphasis">{{ user.email }}</div>
      </div>
    </v-card-title>

    <v-card-text class="pa-0">
      <v-list density="compact" class="pa-0">
        <v-list-item>
          <template #prepend>
            <v-icon color="primary" size="small">mdi-shield-account</v-icon>
          </template>
          <v-list-item-title class="text-body-2">Role</v-list-item-title>
          <template #append>
            <v-chip :color="getRoleColor(user.role)" size="small" variant="tonal">
              {{ user.role }}
            </v-chip>
          </template>
        </v-list-item>

        <v-list-item>
          <template #prepend>
            <v-icon color="success" size="small">mdi-calendar-plus</v-icon>
          </template>
          <v-list-item-title class="text-body-2">Created</v-list-item-title>
          <template #append>
            <span class="text-body-2 text-medium-emphasis">
              {{ formatDate(user.created_at) }}
            </span>
          </template>
        </v-list-item>

        <v-list-item>
          <template #prepend>
            <v-icon color="info" size="small">mdi-calendar-edit</v-icon>
          </template>
          <v-list-item-title class="text-body-2">Updated</v-list-item-title>
          <template #append>
            <span class="text-body-2 text-medium-emphasis">
              {{ formatDate(user.updated_at) }}
            </span>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.user-info-widget {
  border-radius: 12px;
}
</style>
