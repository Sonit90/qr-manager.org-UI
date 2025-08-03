<script setup lang="ts">
import { nextTick, reactive, ref, type Ref } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { TypeMergeProcessCreateV1 } from '@/api/__generated__/v1/data-contracts.ts'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import { notify } from '@kyvg/vue3-notification'
import { handleApiError } from '@/api/helpers/handleApiError.ts'

const mergeData = reactive({ name: '', description: '' })
const isValid = ref(false)
const mergeForm = ref<Ref | null>(null)

function $reset() {
  Object.assign(mergeData, { name: '', description: '' })
  isValid.value = false
}

const queryClient = useQueryClient()
const { mutate } = useMutation({
  mutationFn: (data: TypeMergeProcessCreateV1) => {
    return ApiClientV1.mergeCreateMergeProcess(data)
  },
  onError: (error) => {
    handleApiError(error, { title: 'Update user' })
  },
})

async function onOkay(isActive: Ref<boolean>) {
  if (!mergeForm.value) {
    return
  }
  await mergeForm.value.validate()
  if (!isValid.value) {
    return
  }
  mutate(mergeData, {
    onSettled() {
      queryClient.invalidateQueries({ queryKey: ['fetchMerges'] })
      isActive.value = false
      $reset()
      notify({
        title: 'Transformation',
        text: 'Transformation has been created successfully',
        type: 'success',
      })
    },
  })
}

async function onCancel(isActive: Ref<boolean>) {
  $reset()
  isActive.value = false
  await nextTick()
}
</script>

<template>
  <v-dialog max-width="600">
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="primary"
        text="Create Transformation"
        prepend-icon="mdi-plus"
      />
    </template>
    <template #default="{ isActive }">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center py-1">
          <div class="text-h5 text-medium-emphasis">Create transformation</div>
          <v-btn icon="mdi-close" variant="text" @click="onCancel(isActive)" />
        </v-card-title>
        <v-card-text>
          <v-form ref="mergeForm" v-model="isValid">
            <v-text-field v-model="mergeData.name" class="mb-2" label="Name" hide-details />
            <v-text-field v-model="mergeData.description" label="Description" hide-details />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text="Cancel" variant="text" @click="onCancel(isActive)" />
          <v-btn
            :disabled="!isValid"
            text="Create"
            color="primary"
            variant="tonal"
            prepend-icon="mdi-upload"
            @click="onOkay(isActive)"
          />
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
