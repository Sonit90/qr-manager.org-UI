<script setup lang="ts">
import type { TypeUserPublicV1 } from '@/api/__generated__/v1/data-contracts.ts'
import BooleanIcon from '@/components/BooleanIcon.vue'

defineProps<{
  loading: boolean
  deleteId: string | null
  users: TypeUserPublicV1[]
}>()

const emit = defineEmits<{
  delete: [userId: string]
}>()

function onDelete(item: TypeUserPublicV1) {
  if (!item.id) return

  if (confirm(`Are you sure you want to delete user ${item.email} ?`)) {
    emit('delete', item.id)
  }
}

const headers = [
  { title: 'Email', key: 'email' },
  { title: 'Full name', key: 'full_name' },
  { title: 'Role', key: 'role' },
  { title: 'Is Active', key: 'is_active' },
  { title: 'Is Superuser', key: 'is_superuser' },
  { title: 'Created At', key: 'created_at' },
  { title: 'Actions', key: 'actions' },
]
</script>

<template>
  <v-data-table
    :loading="loading"
    :headers="headers"
    :items="users"
    :items-per-page="10"
    class="elevation-1"
  >
    <template #item.created_at="{ item }">
      <template v-if="item.created_at">
        {{ new Date(item.created_at).toLocaleString() }}
      </template>
    </template>

    <template #item.is_active="{ item }">
      <BooleanIcon :value="item.is_active" />
    </template>

    <template #item.is_superuser="{ item }">
      <BooleanIcon :value="item.is_superuser" />
    </template>

    <template #item.actions="{ item }">
      <div class="d-flex gap-2">
        <v-btn
          :disabled="deleteId === item.id"
          variant="text"
          color="error"
          size="small"
          title="Delete"
          icon="mdi-delete"
          @click="onDelete(item)"
        />
      </div>
    </template>
  </v-data-table>
</template>
