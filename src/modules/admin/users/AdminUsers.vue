<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAdminUsers } from '@/modules/admin/users/composables/useAdminUsers.ts'
import UsersTable from '@/modules/admin/users/UsersTable.vue'
import UserForm from '@/modules/admin/users/UserForm.vue'
import type { TypeUserV1 } from '@/api/__generated__/v1/data-contracts.ts'
import { handleApiError } from '@/api/helpers/handleApiError.ts'

const { users, loading, fetchUsers, deleteUser } = useAdminUsers()

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

const deletingUser = ref<TypeUserV1 | undefined>(undefined)
const deleteConfirmText = ref('')
const isDeleting = ref(false)

const deleteConfirmed = computed(() => deleteConfirmText.value.toLowerCase() === 'delete')

function onDeleteRequest(user: TypeUserV1) {
  deletingUser.value = user
  deleteConfirmText.value = ''
}

function onDeleteCancel() {
  deletingUser.value = undefined
  deleteConfirmText.value = ''
}

async function onDeleteConfirm() {
  if (!deletingUser.value || !deleteConfirmed.value) return
  isDeleting.value = true
  try {
    await deleteUser(deletingUser.value.id)
    onDeleteCancel()
  } catch (e) {
    handleApiError(e, { title: 'Delete User' })
  } finally {
    isDeleting.value = false
  }
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
        <UsersTable
          :loading="loading"
          :users="filteredUsers"
          @edit="onEdit($event)"
          @delete="onDeleteRequest($event)"
        />
      </div>
    </section>

    <UserForm
      v-if="isActive && editingUser"
      v-model:dialog="isActive"
      :user="editingUser"
      @updated="onCancel()"
      @cancel="onCancel()"
    />

    <v-dialog
      v-if="!!deletingUser"
      model-value
      max-width="440"
      class="app-dialog"
      @update:model-value="onDeleteCancel"
    >
      <v-card data-testid="delete-user-dialog">
        <div class="app-dialog-title">
          <div>
            <span class="app-eyebrow">Admin</span>
            <h3>Delete User</h3>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="onDeleteCancel" />
        </div>
        <div class="app-dialog-body">
          <p class="delete-warning">
            This will permanently delete <strong>{{ deletingUser?.email }}</strong>. This action
            cannot be undone.
          </p>
          <label class="delete-confirm-label" for="delete-confirm-input">
            Type <strong>delete</strong> to confirm
          </label>
          <input
            id="delete-confirm-input"
            v-model="deleteConfirmText"
            type="text"
            class="app-input delete-confirm-input"
            autocomplete="off"
            aria-label="Type delete to confirm"
          />
        </div>
        <div class="app-dialog-actions">
          <button
            type="button"
            class="app-btn app-btn-ghost"
            :disabled="isDeleting"
            @click="onDeleteCancel"
          >
            Cancel
          </button>
          <button
            type="button"
            class="app-btn app-btn-danger"
            :disabled="!deleteConfirmed || isDeleting"
            @click="onDeleteConfirm"
          >
            <v-progress-circular v-if="isDeleting" size="14" width="2" indeterminate />
            Delete User
          </button>
        </div>
      </v-card>
    </v-dialog>
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

.delete-warning {
  color: var(--ink);
  font-size: 14px;
  margin-bottom: 16px;
}

.delete-confirm-label {
  display: block;
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 8px;
}

.delete-confirm-input {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 9px 12px;
  font-size: 14px;
  background: var(--bg-soft);
  color: var(--ink);
  outline: none;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}

.delete-confirm-input:focus {
  background: #fff;
  border-color: var(--accent);
}
</style>
