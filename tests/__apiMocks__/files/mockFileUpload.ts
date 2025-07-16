import { vi } from 'vitest'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import { FileUploadService } from '@/api/services/FileUploadService.ts'
import { createAxiosError } from '@tests/helpers/createAxiosError.ts'
import { faker } from '@faker-js/faker'

export function mockFileGetUploadUrl(uploadUrl: string = faker.internet.url()) {
  const response = { upload_url: uploadUrl }
  const mockedGetUploadUrl = vi.fn().mockResolvedValue(response)
  vi.spyOn(ApiClientV1, 'filesGetUploadUrl').mockImplementation(mockedGetUploadUrl)

  return { mockedGetUploadUrl, uploadUrl }
}

export function mockFileGetUploadUrlError(message: string, statusCode = 500) {
  const error = createAxiosError(message, { status: statusCode })
  const mockedGetUploadUrl = vi.fn().mockRejectedValue(error)
  vi.spyOn(ApiClientV1, 'filesGetUploadUrl').mockImplementation(mockedGetUploadUrl)

  return { mockedGetUploadUrl }
}

export function mockFileUploadToMinIO(success: boolean = true) {
  const mockedUploadToMinIO = vi.fn().mockResolvedValue(success)
  vi.spyOn(FileUploadService, 'uploadToMinIO').mockImplementation(mockedUploadToMinIO)

  return { mockedUploadToMinIO }
}

export function mockFileUploadFlow({
  uploadUrl = faker.internet.url(),
  uploadSuccess = true,
  getUploadUrlSuccess = true,
  getUploadUrlError = 'Failed to get upload URL',
} = {}) {
  let mockedGetUploadUrl: ReturnType<typeof vi.fn>
  let mockedUploadToMinIO: ReturnType<typeof vi.fn>

  if (getUploadUrlSuccess) {
    const result = mockFileGetUploadUrl(uploadUrl)
    mockedGetUploadUrl = result.mockedGetUploadUrl
  } else {
    const result = mockFileGetUploadUrlError(getUploadUrlError)
    mockedGetUploadUrl = result.mockedGetUploadUrl
  }

  if (uploadSuccess && getUploadUrlSuccess) {
    const result = mockFileUploadToMinIO(true)
    mockedUploadToMinIO = result.mockedUploadToMinIO
  } else if (getUploadUrlSuccess) {
    const result = mockFileUploadToMinIO(false)
    mockedUploadToMinIO = result.mockedUploadToMinIO
  } else {
    // Don't mock upload if get upload URL fails
    mockedUploadToMinIO = vi.fn()
  }

  return {
    mockedGetUploadUrl,
    mockedUploadToMinIO,
    uploadUrl,
  }
}
