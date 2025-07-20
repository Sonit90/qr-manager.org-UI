<script setup lang="ts">
import { ref, reactive, type Ref, computed, watch } from 'vue'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import { handleApiError } from '@/api/helpers/handleApiError.ts'
import { hasMinLength, isRequired, isValidEmail } from '@/helpers/validations/validations.ts'
import { notify } from '@kyvg/vue3-notification'
import type { TypeUserCreateV1, TypeUserPublicV1 } from '@/api/__generated__/v1/data-contracts.ts'
import { FormMode, userSettings } from '@/modules/admin/users/userTypes.ts'

const dialog = defineModel<boolean>('dialog')

const props = defineProps<{
  formData?: Partial<TypeUserPublicV1>
}>()

const emit = defineEmits<{
  created: []
  updated: [userId: string]
  cancel: []
}>()

const newUser = () => ({
  email: '',
  password: '',
  is_active: true,
  is_superuser: false,
  full_name: '',
  role: 'readonly',
})

const user = reactive<Omit<TypeUserCreateV1, 'confirm_password'>>(newUser())

watch(
  () => props.formData,
  (val) => {
    if (val) {
      Object.assign(user, { ...val })
    } else {
      Object.assign(user, newUser())
    }
  },
  { immediate: true },
)

const isLoading = ref(false)
const isValid = ref(false)
const userForm = ref<Ref | null>(null)

function $reset() {
  dialog.value = false
  Object.assign(user, newUser())
}

async function onActionClick() {
  await userForm.value.validate()
  if (!isValid.value) return
  if (mode.value === FormMode.EDIT) {
    await onUserUpdate()
  } else {
    await onUserCreate()
  }
}

async function onUserCreate() {
  try {
    isLoading.value = true
    await ApiClientV1.adminCreateUser({ ...user, confirm_password: user.password })
    notify({ title: 'User created' })
    emit('created')
    $reset()
  } catch (e) {
    handleApiError(e, { title: 'Create User' })
  } finally {
    isLoading.value = false
  }
}

async function onUserUpdate() {
  if (!props.formData?.id) return

  try {
    isLoading.value = true
    await ApiClientV1.adminUpdateUser(props.formData.id, user)
    notify({ title: 'User updated' })
    emit('updated', props.formData.id)
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

const emailRules = [isRequired('E-mail'), isValidEmail]

const passwordRules = [isRequired('Password'), hasMinLength(8)]

const showPassword = ref(false)

const mode = computed(() => (props.formData ? FormMode.EDIT : FormMode.CREATE))
const currentSetting = computed(() => userSettings[mode.value])
</script>

<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card data-testid="user-form">
      <v-card-title class="d-flex justify-space-between align-center py-1">
        <div class="text-h5 text-medium-emphasis">{{ currentSetting.title }}</div>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" />
      </v-card-title>
      <v-card-text>
        <v-form ref="userForm" v-model="isValid">
          <v-text-field
            v-model.trim="user.email"
            :rules="emailRules"
            label="Email"
            prepend-inner-icon="mdi-email"
            variant="outlined"
            color="primary"
            required
          />
          <v-text-field
            v-model.trim="user.full_name"
            label="Full Name"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            color="primary"
            required
          />
          <v-select
            v-model="user.role"
            label="Role"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            color="primary"
            :items="[
              'readonly',
              'client-paid',
              'client-unpaid',
              'client-poblaty',
              'manager',
              'content-manager',
              'admin',
              'god',
            ]"
          />
          <v-row no-gutters>
            <v-col>
              <v-switch v-model="user.is_active" color="primary" label="Is Active" />
            </v-col>
            <v-col>
              <v-switch v-model="user.is_superuser" color="primary" label="Is Super user" />
            </v-col>
          </v-row>
          <v-text-field
            v-model.trim="user.password"
            :rules="passwordRules"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            autocomplete="off"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            prepend-inner-icon="mdi-lock"
            variant="outlined"
            color="primary"
            required
            @click:append-inner="showPassword = !showPassword"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text="Cancel" variant="text" @click="onCancel()" />
        <v-btn
          :disabled="!isValid"
          :text="currentSetting.buttonTitle"
          :loading="isLoading"
          color="primary"
          variant="tonal"
          :append-icon="currentSetting.buttonIcon"
          @click="onActionClick()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
