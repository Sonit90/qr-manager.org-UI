<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCloned } from '@vueuse/core'
import EditableUserField from '@/modules/user/EditableUserField.vue'
import { handleApiError } from '@/api/helpers/handleApiError.ts'
import { notify } from '@kyvg/vue3-notification'
import { formatDate } from '@/helpers/formatDate.ts'
import { useUser } from '@/tanstack/useUser.ts'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import type { TypeUserUpdateMeV1 } from '@/api/__generated__/v1/data-contracts.ts'

const getRoleColor = (role?: string) => {
  if (!role) {
    return 'primary'
  }
  const colors: Record<string, string> = {
    admin: 'error',
    moderator: 'warning',
    user: 'primary',
    guest: 'secondary',
  }
  return colors[role.toLowerCase()] || 'primary'
}

const { isLoading, data: user } = useUser()

const safeUser = computed(() => user.value ?? null)

const isEditing = ref(false)
const { cloned, sync } = useCloned(safeUser)

function handleEditUser() {
  isEditing.value = true
  sync()
}

function handleCancelEdit() {
  isEditing.value = false
}

const hasChanges = computed(() => cloned.value?.full_name !== user.value?.full_name)

const queryClient = useQueryClient()
const { isPending, mutate } = useMutation({
  mutationFn: (data: TypeUserUpdateMeV1) => ApiClientV1.userUpdateCurrentUser(data),
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['fetchUser'] })
    isEditing.value = false
    notify({
      title: 'User profile',
      text: 'Profile has been edited successfully',
      type: 'success',
    })
  },
  onError: (error) => {
    handleApiError(error, { title: 'Update user' })
  },
})

function handleApply() {
  mutate({ full_name: cloned.value?.full_name })
}
</script>
<template>
  <div v-if="isLoading" class="d-flex justify-center align-center" style="height: 200px">
    <v-progress-circular indeterminate color="primary" size="48" />
  </div>
  <v-card
    v-else
    data-testid="user-info-container"
    class="user-info-widget"
    max-width="400"
    elevation="2"
  >
    <v-card-title v-if="user" class="d-flex align-center">
      <v-avatar color="primary" class="me-3">
        <v-icon color="white">mdi-account</v-icon>
      </v-avatar>
      <div class="text-h6">User Profile</div>
      <v-btn
        v-if="!isEditing"
        color="primary"
        variant="text"
        icon="mdi-pencil"
        size="small"
        class="ml-auto"
        data-testid="edit-user-button"
        @click="handleEditUser"
      />

      <v-btn
        v-if="isEditing"
        variant="text"
        icon="mdi-cancel"
        size="small"
        class="ml-auto"
        data-testid="cancel-edit-button"
        @click="handleCancelEdit()"
      />
      <v-btn
        v-if="isEditing"
        color="success"
        variant="text"
        icon="mdi-check"
        :loading="isPending"
        size="small"
        :disabled="!hasChanges"
        data-testid="save-edit-button"
        @click="handleApply()"
      />
    </v-card-title>

    <v-card-text v-if="user && cloned" data-testid="user-page-edit-form" class="pa-0">
      <v-list density="compact" class="pa-0">
        <EditableUserField
          v-model="cloned.email"
          :original-value="user.email"
          icon="mdi-email"
          label="Email"
        />
        <EditableUserField
          v-model="cloned.full_name"
          :original-value="user.full_name"
          :is-editing="isEditing"
          icon="mdi-account"
          label="Name"
        />

        <EditableUserField icon="mdi-shield-account" label="Role">
          <v-chip :color="getRoleColor(user.role)" size="small" variant="tonal">
            {{ user.role }}
          </v-chip>
        </EditableUserField>

        <EditableUserField
          icon="mdi-calendar-plus"
          label="Created"
          :model-value="formatDate(user.created_at)"
        />

        <EditableUserField
          icon="mdi-calendar-edit"
          label="Updated"
          :model-value="formatDate(user.updated_at)"
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
