<script setup lang="ts">
import type { TypeUserV1 } from '@/api/__generated__/v1/data-contracts.ts'
import BooleanIcon from '@/components/BooleanIcon.vue'

defineProps<{
  loading: boolean
  users: TypeUserV1[]
}>()

const emit = defineEmits<{
  edit: [user: TypeUserV1]
  delete: [user: TypeUserV1]
}>()

const headers = [
  { title: 'Email', key: 'email' },
  { title: 'Display Name', key: 'display_name' },
  { title: 'Role', key: 'role' },
  { title: 'Is Active', key: 'is_active' },
  { title: 'Email Verified', key: 'email_verified' },
  { title: 'Created At', key: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]

function roleBadgeClass(role?: string) {
  switch ((role ?? '').toLowerCase()) {
    case 'admin':
      return 'app-badge-danger'
    case 'moderator':
      return 'app-badge-warning'
    default:
      return 'app-badge-accent'
  }
}
</script>

<template>
  <v-data-table
    :loading="loading"
    :headers="headers"
    :items="users"
    :items-per-page="10"
    mobile-breakpoint="sm"
    disable-sort
    class="users-table"
  >
    <template #item.email="{ item }">
      <div class="user-cell">
        <span class="user-avatar">{{
          (item.email || item.display_name || '?').charAt(0).toUpperCase()
        }}</span>
        <span class="user-email">{{ item.email }}</span>
      </div>
    </template>

    <template #item.display_name="{ item }">
      {{ item.display_name || '—' }}
    </template>

    <template #item.role="{ item }">
      <span class="app-badge" :class="roleBadgeClass(item.role)">{{ item.role }}</span>
    </template>

    <template #item.is_active="{ item }">
      <BooleanIcon :value="item.is_active" />
    </template>

    <template #item.email_verified="{ item }">
      <BooleanIcon :value="item.email_verified" />
    </template>

    <template #item.created_at="{ item }">
      <span class="cell-date">{{ new Date(item.created_at).toLocaleDateString() }}</span>
    </template>

    <template #item.actions="{ item }">
      <button
        type="button"
        class="app-btn app-btn-ghost app-btn-icon"
        title="Edit"
        aria-label="Edit user"
        @click="emit('edit', item)"
      >
        <v-icon icon="mdi-pencil" size="18" />
      </button>
      <button
        type="button"
        class="app-btn app-btn-ghost app-btn-icon app-btn-danger"
        title="Delete"
        aria-label="Delete user"
        @click="emit('delete', item)"
      >
        <v-icon icon="mdi-delete" size="18" />
      </button>
    </template>
  </v-data-table>
</template>

<style scoped>
.user-cell {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gradient);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
}

.user-email {
  font-weight: 500;
  color: var(--ink);
}

.cell-date {
  color: var(--muted);
  font-size: 13px;
}
</style>
