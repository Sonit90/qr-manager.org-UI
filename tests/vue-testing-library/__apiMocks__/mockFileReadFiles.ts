import { vi } from 'vitest'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import type { TypeFileV1 } from '@/api/__generated__/v1/data-contracts.ts'
import { createAxiosError } from '@tests/helpers/createAxiosError.ts'

export function mockFileReadFiles(response: TypeFileV1[]) {
  const mockedFileReadFile = vi.fn().mockResolvedValue(response)
  vi.spyOn(ApiClientV1, 'filesReadFiles').mockImplementation(mockedFileReadFile)

  return { mockedFileReadFile }
}

export function mockFileReadFilesError(message: string, statusCode = 500) {
  const error = createAxiosError(message, { status: statusCode })
  const mockedFileReadFile = vi.fn().mockRejectedValue(error)
  vi.spyOn(ApiClientV1, 'filesReadFiles').mockImplementation(mockedFileReadFile)

  return { mockedFileReadFile }
}
