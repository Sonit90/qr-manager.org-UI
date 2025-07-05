<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCloned } from '@vueuse/core'
import EditableUserField from '@/modules/user/EditableUserField.vue'
import { handleApiError } from '@/api/helpers/handleApiError.ts'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore.ts'

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

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

const userStore = useUserStore()
const { isLoading, user } = storeToRefs(userStore)

const isEditing = ref(false)
const { cloned, sync } = useCloned(user)

function handleEditUser() {
  isEditing.value = true
  sync()
}

function handleCancelEdit() {
  isEditing.value = false
}

async function loadUser() {
  await userStore.fetchUser()
}

loadUser()

const hasChanges = computed(() => cloned.value?.full_name !== user.value?.full_name)

async function handleApply() {
  try {
    await userStore.editUser({ full_name: cloned.value?.full_name })
  } catch (e) {
    handleApiError(e, { title: 'Update user' })
  }
}
</script>
<template>
  <div v-if="isLoading" class="d-flex justify-center align-center" style="height: 200px">
    <v-progress-circular indeterminate color="primary" size="48" />
  </div>
  <v-card v-else class="user-info-widget" max-width="400" elevation="2">
    <v-card-title v-if="user" class="d-flex align-center">
      <v-avatar color="primary" class="me-3">
        <v-icon color="white">mdi-account</v-icon>
      </v-avatar>
      <div>
        <div class="text-h6">{{ user.full_name }}</div>
        <div class="text-caption text-medium-emphasis">{{ user.email }}</div>
      </div>
      <v-btn
        v-if="!isEditing"
        color="primary"
        variant="text"
        icon="mdi-pencil"
        size="small"
        class="ml-auto"
        @click="handleEditUser"
      />

      <v-btn
        v-if="isEditing"
        variant="text"
        icon="mdi-cancel"
        size="small"
        class="ml-auto"
        @click="handleCancelEdit()"
      />
      <v-btn
        v-if="isEditing"
        color="success"
        variant="text"
        icon="mdi-check"
        :loading="isLoading"
        size="small"
        :disabled="!hasChanges"
        @click="handleApply()"
      />
    </v-card-title>

    <v-card-text v-if="cloned" class="pa-0">
      <v-list density="compact" class="pa-0">
        <EditableUserField v-model="cloned.email" icon="mdi-email" label="Email" />
        <EditableUserField
          v-model="cloned.full_name"
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
