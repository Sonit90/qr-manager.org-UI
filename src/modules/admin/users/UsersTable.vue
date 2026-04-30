<script setup lang="ts">
import type { TypeUserV1 } from '@/api/__generated__/v1/data-contracts.ts'
import BooleanIcon from '@/components/BooleanIcon.vue'

defineProps<{
  loading: boolean
  users: TypeUserV1[]
}>()

const emit = defineEmits<{
  edit: [user: TypeUserV1]
}>()

const headers = [
  { title: 'Email', key: 'email' },
  { title: 'Display Name', key: 'display_name' },
  { title: 'Role', key: 'role' },
  { title: 'Is Active', key: 'is_active' },
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
      {{ new Date(item.created_at).toLocaleString() }}
    </template>

    <template #item.is_active="{ item }">
      <BooleanIcon :value="item.is_active" />
    </template>

    <template #item.actions="{ item }">
      <v-btn
        variant="text"
        color="primary"
        size="small"
        title="Edit"
        icon="mdi-pencil"
        @click="emit('edit', item)"
      />
    </template>
  </v-data-table>
</template>
