import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import type { TypeOutputFormatV1 } from '@/api/__generated__/v1/data-contracts.ts'
import { generateFormat } from './generateFormat.ts'

export function mockListFormats(count = 3) {
  const formats = Array.from({ length: count }, () => generateFormat())
  const mockedListFormats = vi.fn().mockResolvedValue(formats)
  vi.spyOn(ApiClientV1, 'listFormats').mockImplementation(mockedListFormats)
  return { mockedListFormats, formats }
}

export function mockGetFormat(format?: TypeOutputFormatV1) {
  const data = format ?? generateFormat()
  const mockedGetFormat = vi.fn().mockResolvedValue(data)
  vi.spyOn(ApiClientV1, 'getFormat').mockImplementation(mockedGetFormat)
  return { mockedGetFormat, format: data }
}

export function mockCreateFormat(format?: TypeOutputFormatV1) {
  const data = format ?? generateFormat()
  const mockedCreateFormat = vi.fn().mockResolvedValue(data)
  vi.spyOn(ApiClientV1, 'createFormat').mockImplementation(mockedCreateFormat)
  return { mockedCreateFormat, format: data }
}

export function mockDeleteFormat() {
  const mockedDeleteFormat = vi.fn().mockResolvedValue(undefined)
  vi.spyOn(ApiClientV1, 'deleteFormat').mockImplementation(mockedDeleteFormat)
  return { mockedDeleteFormat }
}
