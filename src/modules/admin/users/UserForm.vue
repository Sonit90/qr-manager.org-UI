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

function $reset() {
  dialog.value = false
}

async function onSubmit() {
  await userForm.value.validate()
  if (!isValid.value) return

  try {
    isLoading.value = true
    await updateUser(props.user, { role: form.role, active: form.active })
    emit('updated', { ...props.user, role: form.role, is_active: form.active })
    $reset()
  } catch (e) {
    handleApiError(e, { title: 'Update User' })
  } finally {
    isLoading.value = false
  }
}

function onCancel() {
  $reset()
  emit('cancel')
}

const roleItems = [
  { title: 'Admin', value: TypeRoleV1.EnumAdmin },
  { title: 'Moderator', value: TypeRoleV1.EnumModerator },
  { title: 'User', value: TypeRoleV1.EnumUser },
]
</script>

<template>
  <v-dialog v-model="dialog" :max-width="smAndDown ? undefined : 500" :fullscreen="smAndDown">
    <v-card data-testid="user-form">
      <v-card-title class="d-flex justify-space-between align-center py-1">
        <div class="text-h5 text-medium-emphasis">Edit User</div>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      <v-card-text>
        <div class="mb-4 text-body-2 text-medium-emphasis">{{ user.email }}</div>
        <v-form ref="userForm" v-model="isValid">
          <v-select
            v-model="form.role"
            label="Role"
            prepend-inner-icon="mdi-shield-account"
            variant="outlined"
            color="primary"
            :items="roleItems"
            :rules="[(v) => !!v || 'Role is required']"
          />
          <v-switch v-model="form.active" color="primary" label="Is Active" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text="Cancel" variant="text" @click="onCancel()" />
        <v-btn
          :disabled="!isValid"
          text="Update User"
          :loading="isLoading"
          color="primary"
          variant="tonal"
          append-icon="mdi-account-edit"
          @click="onSubmit()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
