<script setup lang="ts">
import { ref, reactive, type Ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { handleApiError } from '@/api/helpers/handleApiError.ts'
import { TypeRoleV1, type TypeUserV1 } from '@/api/__generated__/v1/data-contracts.ts'
import { useAdminUsers } from '@/modules/admin/users/composables/useAdminUsers.ts'

const { smAndDown } = useDisplay()

const dialog = defineModel<boolean>('dialog')

const props = defineProps<{
  user: TypeUserV1
}>()

const emit = defineEmits<{
  updated: [user: TypeUserV1]
  cancel: []
}>()

const { updateUser } = useAdminUsers()

const form = reactive({
  role: props.user.role,
  active: props.user.is_active,
})

watch(
  () => props.user,
  (val) => {
    form.role = val.role
    form.active = val.is_active
  },
)

const isLoading = ref(false)
const isValid = ref(false)
const userForm = ref<Ref | null>(null)

function close() {
  dialog.value = false
}

async function onSubmit() {
  await userForm.value?.validate()
  if (!isValid.value) return

  try {
    isLoading.value = true
    await updateUser(props.user, { role: form.role, active: form.active })
    emit('updated', { ...props.user, role: form.role, is_active: form.active })
    close()
  } catch (e) {
    handleApiError(e, { title: 'Update User' })
  } finally {
    isLoading.value = false
  }
}

function onCancel() {
  close()
  emit('cancel')
}

const roleItems = [
  { title: 'Admin', value: TypeRoleV1.EnumAdmin },
  { title: 'Moderator', value: TypeRoleV1.EnumModerator },
  { title: 'User', value: TypeRoleV1.EnumUser },
]
</script>

<template>
  <v-dialog
    v-model="dialog"
    :max-width="smAndDown ? undefined : 480"
    :fullscreen="smAndDown"
    class="app-dialog"
  >
    <v-card data-testid="user-form">
      <div class="app-dialog-title">
        <div>
          <span class="app-eyebrow">Admin</span>
          <h3>Edit User</h3>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="dialog = false" />
      </div>
      <div class="app-dialog-body">
        <div class="user-meta">
          <span class="user-avatar">
            {{ (user.email || user.display_name || '?').charAt(0).toUpperCase() }}
          </span>
          <div>
            <div class="user-email">{{ user.email }}</div>
            <div class="user-sub">{{ user.display_name || 'No display name' }}</div>
          </div>
        </div>

        <v-form ref="userForm" v-model="isValid" class="form-fields">
          <v-select
            v-model="form.role"
            label="Role"
            prepend-inner-icon="mdi-shield-account"
            variant="outlined"
            color="primary"
            :items="roleItems"
            :rules="[(v) => !!v || 'Role is required']"
          />
          <v-switch v-model="form.active" color="primary" label="Is Active" hide-details />
        </v-form>
      </div>
      <div class="app-dialog-actions">
        <button
          type="button"
          class="app-btn app-btn-ghost"
          :disabled="isLoading"
          @click="onCancel"
        >
          Cancel
        </button>
        <button
          type="button"
          class="app-btn app-btn-primary"
          :disabled="!isValid || isLoading"
          @click="onSubmit"
        >
          <v-progress-circular v-if="isLoading" size="14" width="2" indeterminate />
          Update User
        </button>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.user-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: 12px;
  margin-bottom: 18px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gradient);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.user-email {
  font-weight: 600;
  color: var(--ink);
  font-size: 14.5px;
}

.user-sub {
  color: var(--muted);
  font-size: 13px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
