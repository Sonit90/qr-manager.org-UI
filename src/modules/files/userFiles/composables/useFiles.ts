import { ref } from 'vue'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import type { TypeFileV1 } from '@/api/__generated__/v1/data-contracts.ts'
import { handleApiError } from '@/api/helpers/handleApiError.ts'
import { notify } from '@kyvg/vue3-notification'
import { FileUploadService } from '@/api/services/FileUploadService.ts'

const loading = ref(false)
const uploading = ref(false)
const deleting = ref(false)
const files = ref<TypeFileV1[]>([])

export function useFiles() {
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
      const response = await ApiClientV1.filesGetDownloadUrl(fileId)

      // Open the download URL in a new tab
      if (response && response.download_url) {
        window.open(response.download_url, '_blank')
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

  async function uploadFile(file: File): Promise<boolean> {
    if (!file) return false

    uploading.value = true
    error.value = null

    try {
      // Get the upload URL from the API
      const response = await ApiClientV1.filesGetUploadUrl({
        original_filename: file.name,
      })

      // Upload the file to MinIO using the presigned URL
      const uploadSuccess = await FileUploadService.uploadToMinIO(file, response.upload_url)

      if (uploadSuccess) {
        // Refresh the files list after a successful upload
        await fetchFiles()
        return true
      }

      return false
    } catch (err) {
      handleApiError(err, { title: 'Upload' })
      error.value = 'Failed to upload file. Please try again later.'
      return false
    } finally {
      uploading.value = false
    }
  }

  async function deleteFile(fileId: number): Promise<boolean> {
    if (!fileId) return false

    deleting.value = true
    error.value = null

    try {
      await ApiClientV1.filesDeleteFile(fileId)

      // Refresh the files list after successful deletion
      await fetchFiles()

      notify({
        type: 'success',
        title: 'Delete',
        text: 'File deleted successfully',
      })

      return true
    } catch (err) {
      handleApiError(err, { title: 'Delete' })
      error.value = 'Failed to delete file. Please try again later.'
      return false
    } finally {
      deleting.value = false
    }
  }

  return {
    files,
    loading,
    error,
    uploading,
    deleting,
    downloadingFileId,
    fetchFiles,
    downloadFile,
    uploadFile,
    deleteFile,
  }
}
