<script setup lang="ts">
import { useAdminUsers } from '@/modules/admin/users/composables/useAdminUsers.ts'
import UsersTable from '@/modules/admin/users/UsersTable.vue'
import UserForm from '@/modules/admin/users/UserForm.vue'
import { ref } from 'vue'
import type { TypeUserPublicV1 } from '@/api/__generated__/v1/data-contracts.ts'

const { users, loading, deleteId, fetchUsers, fetchUser, deleteUser } = useAdminUsers()

fetchUsers()

const isActive = ref(false)
const user = ref<TypeUserPublicV1 | undefined>(undefined)

function onEdit(editedUser: TypeUserPublicV1) {
  user.value = editedUser
  isActive.value = true
}

function onCancel() {
  isActive.value = false
  user.value = undefined
}
</script>

<template>
  <v-card class="mb-4">
    <v-card-title class="d-flex">
      <h1 class="text-h4">All users</h1>
      <v-spacer />
      <v-btn
        color="primary"
        prepend-icon="mdi-account-plus"
        text="Create User"
        @click="isActive = true"
      />
      <UserForm
        v-if="isActive"
        v-model:dialog="isActive"
        v-model:form-data="user"
        @created="fetchUsers()"
        @updated="fetchUser($event)"
        @cancel="onCancel()"
      />
    </v-card-title>
    <v-card-text>
      <UsersTable
        :loading="loading"
        :users="users"
        :delete-id="deleteId"
        @edit="onEdit($event)"
        @delete="deleteUser($event)"
      />
    </v-card-text>
  </v-card>
</template>
