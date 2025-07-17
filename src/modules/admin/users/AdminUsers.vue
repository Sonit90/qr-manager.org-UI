<script setup lang="ts">
import { useAdminUsers } from '@/modules/admin/users/composables/useAdminUsers.ts'
import UsersTable from '@/modules/admin/users/UsersTable.vue'

const { users, loading, deleteId, fetchUsers, deleteUser } = useAdminUsers()

fetchUsers()
</script>

<template>
  <div>
    <h1 class="text-h4">All users</h1>

    <v-card class="mb-4">
      <v-card-text>
        <UsersTable
          :loading="loading"
          :users="users"
          :delete-id="deleteId"
          @delete="deleteUser($event)"
        />
      </v-card-text>
    </v-card>
  </div>
</template>
