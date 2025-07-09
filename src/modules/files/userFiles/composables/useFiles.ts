import { ref } from 'vue'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import type { TypeFileV1 } from '@/api/__generated__/v1/data-contracts.ts'
import { handleApiError } from '@/api/helpers/handleApiError.ts'
import { notify } from '@kyvg/vue3-notification'

export function useFiles() {
  const files = ref<TypeFileV1[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)
  const downloadingFileId = ref<number | null>(null)

  async function fetchFiles() {
    loading.value = true
    error.value = null

    try {
      files.value = await ApiClientV1.filesReadFiles({})
    } catch (err) {
      handleApiError(err, { title: 'Files' })
      error.value = 'Failed to load files. Please try again later.'
    } finally {
      loading.value = false
    }
  }

  async function downloadFile(fileId: number) {
    if (!fileId) return

    downloadingFileId.value = fileId

    try {
      const response = await ApiClientV1.filesGetDownloadUrl({ fileId })

      // Open the download URL in a new tab
      if (response.data && response.data.url) {
        window.open(response.data.url, '_blank')
        notify({
          type: 'success',
          title: 'Download',
          text: 'Download started successfully',
        })
      } else {
        throw new Error('Download URL not available')
        //TODO Replace with notification
      }
    } catch (err) {
      handleApiError(err, { title: 'Download' })
    } finally {
      downloadingFileId.value = null
    }
  }

  return {
    files,
    loading,
    error,
    downloadingFileId,
    fetchFiles,
    downloadFile,
  }
}
