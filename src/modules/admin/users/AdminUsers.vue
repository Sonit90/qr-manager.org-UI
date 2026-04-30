<script setup lang="ts">
import { useAdminUsers } from '@/modules/admin/users/composables/useAdminUsers.ts'
import UsersTable from '@/modules/admin/users/UsersTable.vue'
import UserForm from '@/modules/admin/users/UserForm.vue'
import { ref } from 'vue'
import type { TypeUserV1 } from '@/api/__generated__/v1/data-contracts.ts'

const { users, loading, fetchUsers } = useAdminUsers()

fetchUsers()

const isActive = ref(false)
const editingUser = ref<TypeUserV1 | undefined>(undefined)

function onEdit(user: TypeUserV1) {
  editingUser.value = user
  isActive.value = true
}

function onCancel() {
  isActive.value = false
  editingUser.value = undefined
}
</script>

<template>
  <v-card class="mb-4">
    <v-card-title class="d-flex">
      <h1 class="text-h4">All users</h1>
    </v-card-title>
    <v-card-text>
      <UsersTable :loading="loading" :users="users" @edit="onEdit($event)" />
      <UserForm
        v-if="isActive && editingUser"
        v-model:dialog="isActive"
        :user="editingUser"
        @updated="onCancel()"
        @cancel="onCancel()"
      />
    </v-card-text>
  </v-card>
</template>
