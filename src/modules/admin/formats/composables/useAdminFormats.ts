import { ref } from 'vue'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import { handleApiError } from '@/api/helpers/handleApiError.ts'
import type {
  TypeCreateFormatReqV1,
  TypeOutputFormatV1,
} from '@/api/__generated__/v1/data-contracts.ts'
import { notify } from '@kyvg/vue3-notification'

const loading = ref(false)
const submitting = ref(false)
const deleteId = ref<string | null>(null)
const formats = ref<TypeOutputFormatV1[]>([])

export function useAdminFormats() {
  async function fetchFormats() {
    loading.value = true
    try {
      formats.value = await ApiClientV1.listFormats()
    } catch (err) {
      handleApiError(err, { title: 'Output formats' })
    } finally {
      loading.value = false
    }
  }

  async function fetchFormat(id: string): Promise<TypeOutputFormatV1 | null> {
    try {
      return await ApiClientV1.getFormat(id)
    } catch (err) {
      handleApiError(err, { title: 'Output format' })
      return null
    }
  }

  async function createFormat(
    data: TypeCreateFormatReqV1,
  ): Promise<TypeOutputFormatV1 | null> {
    submitting.value = true
    try {
      const created = await ApiClientV1.createFormat(data)
      notify({ title: 'Output format created' })
      return created
    } catch (err) {
      handleApiError(err, { title: 'Create output format' })
      throw err
    } finally {
      submitting.value = false
    }
  }

  async function deleteFormat(id: string): Promise<void> {
    deleteId.value = id
    try {
      await ApiClientV1.deleteFormat(id)
      formats.value = formats.value.filter((f) => f.id !== id)
      notify({ title: 'Output format deleted' })
    } catch (err) {
      handleApiError(err, { title: 'Delete output format' })
    } finally {
      deleteId.value = null
    }
  }

  return {
    formats,
    loading,
    submitting,
    deleteId,
    fetchFormats,
    fetchFormat,
    createFormat,
    deleteFormat,
  }
}
