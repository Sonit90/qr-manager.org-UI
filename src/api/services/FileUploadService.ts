import axios from 'axios'
import { notify } from '@kyvg/vue3-notification'

export class FileUploadService {
  /**
   * Upload a file to MinIO using the provided upload URL
   * @param file The file to upload
   * @param uploadUrl The presigned URL for uploading the file
   * @returns Promise<boolean> True if upload was successful, false otherwise
   */
  static async uploadToMinIO(file: File, uploadUrl: string): Promise<boolean> {
    try {
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      })
      
      notify({
        type: 'success',
        title: 'Upload',
        text: 'File uploaded successfully',
      })
      
      return true
    } catch (error) {
      console.error('Error uploading file to MinIO:', error)
      
      notify({
        type: 'error',
        title: 'Upload Failed',
        text: 'Failed to upload file. Please try again later.',
      })
      
      return false
    }
  }
}