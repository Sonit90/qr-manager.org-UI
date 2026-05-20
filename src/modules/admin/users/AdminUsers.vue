<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAdminUsers } from '@/modules/admin/users/composables/useAdminUsers.ts'
import UsersTable from '@/modules/admin/users/UsersTable.vue'
import UserForm from '@/modules/admin/users/UserForm.vue'
import type { TypeUserV1 } from '@/api/__generated__/v1/data-contracts.ts'

const { users, loading, fetchUsers } = useAdminUsers()

fetchUsers()

const isActive = ref(false)
const editingUser = ref<TypeUserV1 | undefined>(undefined)
const search = ref('')

const filteredUsers = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return users.value
  return users.value.filter((u) => {
    return (
      (u.email ?? '').toLowerCase().includes(term) ||
      (u.display_name ?? '').toLowerCase().includes(term) ||
      (u.role ?? '').toLowerCase().includes(term)
    )
  })
})

const totalUsers = computed(() => users.value.length)
const activeUsers = computed(() => users.value.filter((u) => u.is_active).length)
const adminUsers = computed(
  () => users.value.filter((u) => (u.role ?? '').toLowerCase() === 'admin').length,
)

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
  <div class="app-page admin-users">
    <header class="app-page-head">
      <div>
        <span class="app-eyebrow">Administration</span>
        <h1 class="app-page-title">All users</h1>
        <p class="app-page-sub">Review accounts, roles, and activity status.</p>
      </div>
    </header>

    <div class="stats-grid">
      <div class="app-stat">
        <div class="app-stat-label">Total users</div>
        <div class="app-stat-value">{{ totalUsers }}</div>
      </div>
      <div class="app-stat">
        <div class="app-stat-label">Active</div>
        <div class="app-stat-value">{{ activeUsers }}</div>
      </div>
      <div class="app-stat">
        <div class="app-stat-label">Admins</div>
        <div class="app-stat-value">{{ adminUsers }}</div>
      </div>
    </div>

    <section class="panel">
      <div class="panel-head toolbar">
        <div class="search-wrap">
          <v-icon icon="mdi-magnify" size="18" class="search-icon" />
          <input
            v-model="search"
            type="text"
            class="search-input"
            placeholder="Search by email, name, or role"
            aria-label="Search users"
          />
        </div>
      </div>
      <div class="panel-body panel-body-flush">
        <UsersTable :loading="loading" :users="filteredUsers" @edit="onEdit($event)" />
      </div>
    </section>

    <UserForm
      v-if="isActive && editingUser"
      v-model:dialog="isActive"
      :user="editingUser"
      @updated="onCancel()"
      @cancel="onCancel()"
    />
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.toolbar {
  justify-content: flex-start;
}

.search-wrap {
  position: relative;
  width: 100%;
  max-width: 360px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 9px 12px 9px 36px;
  font-size: 14px;
  background: var(--bg-soft);
  color: var(--ink);
  outline: none;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}

.search-input:focus {
  background: #fff;
  border-color: var(--accent);
}

@media (max-width: 720px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
