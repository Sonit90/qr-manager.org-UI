<script setup lang="ts">
import EditableUserField from '@/modules/user/EditableUserField.vue'
import { formatDate } from '@/helpers/formatDate.ts'
import { useUser } from '@/tanstack/useUser.ts'

const getRoleColor = (role?: string) => {
  if (!role) return 'primary'
  const colors: Record<string, string> = {
    admin: 'error',
    moderator: 'warning',
    user: 'primary',
    guest: 'secondary',
  }
  return colors[role.toLowerCase()] || 'primary'
}

const { isLoading, data: user } = useUser()
</script>
<template>
  <div v-if="isLoading" class="d-flex justify-center align-center" style="height: 200px">
    <v-progress-circular indeterminate color="primary" size="48" />
  </div>
  <v-card
    v-else
    data-testid="user-info-container"
    class="user-info-widget mx-auto"
    width="100%"
    max-width="400"
    elevation="2"
  >
    <v-card-title v-if="user" class="d-flex align-center">
      <v-avatar color="primary" class="me-3">
        <v-icon color="white">mdi-account</v-icon>
      </v-avatar>
      <div class="text-h6">User Profile</div>
    </v-card-title>

    <v-card-text v-if="user" class="pa-0">
      <v-list density="compact" class="pa-0">
        <EditableUserField
          icon="mdi-email"
          label="Email"
          :original-value="user.email ?? '—'"
        />
        <EditableUserField
          icon="mdi-account"
          label="Name"
          :original-value="user.display_name ?? '—'"
        />
        <EditableUserField icon="mdi-shield-account" label="Role">
          <v-chip :color="getRoleColor(user.role)" size="small" variant="tonal">
            {{ user.role }}
          </v-chip>
        </EditableUserField>
        <EditableUserField icon="mdi-email-check" label="Email verified">
          <v-icon :color="user.email_verified ? 'success' : 'warning'" size="small">
            {{ user.email_verified ? 'mdi-check-circle' : 'mdi-alert-circle' }}
          </v-icon>
        </EditableUserField>
        <EditableUserField icon="mdi-account-check" label="Active">
          <v-icon :color="user.is_active ? 'success' : 'error'" size="small">
            {{ user.is_active ? 'mdi-check-circle' : 'mdi-close-circle' }}
          </v-icon>
        </EditableUserField>
        <EditableUserField
          icon="mdi-calendar-plus"
          label="Created"
          :original-value="formatDate(user.created_at)"
        />
        <EditableUserField
          icon="mdi-calendar-edit"
          label="Updated"
          :original-value="formatDate(user.updated_at)"
        />
      </v-list>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.user-info-widget {
  border-radius: 12px;
}
</style>
