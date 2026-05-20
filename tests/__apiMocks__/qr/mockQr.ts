import { ApiClientQr } from '@/api/qr/ApiClientQr.ts'
import type {
  TypeQrQrCodeResponse,
  TypeQrScanStatsResponse,
  TypeQrToggleEnabledResponse,
  TypeQrTargetUrlResponse,
} from '@/api/__generated__/qr/data-contracts.ts'
import {
  generateQr,
  generateScanStats,
  generateToggleResponse,
  generateTargetUrlResponse,
} from '@tests/__apiMocks__/qr/generateQr.ts'

export function mockListQrs(qrs?: TypeQrQrCodeResponse[]) {
  const items = qrs ?? Array.from({ length: 3 }, () => generateQr())
  const mockedList = vi.fn().mockResolvedValue(items)
  vi.spyOn(ApiClientQr, 'listUserQrs').mockImplementation(mockedList)
  return { mockedList, qrs: items }
}

export function mockGetQr(qr?: TypeQrQrCodeResponse) {
  const item = qr ?? generateQr()
  const mockedGet = vi.fn().mockResolvedValue(item)
  vi.spyOn(ApiClientQr, 'getQr').mockImplementation(mockedGet)
  return { mockedGet, qr: item }
}

export function mockCreateQr(qr?: TypeQrQrCodeResponse) {
  const created = qr ?? generateQr()
  const mockedCreate = vi.fn().mockResolvedValue(created)
  vi.spyOn(ApiClientQr, 'createQr').mockImplementation(mockedCreate)
  return { mockedCreate, qr: created }
}

export function mockDeleteQr() {
  const mockedDelete = vi.fn()
  vi.spyOn(ApiClientQr, 'deleteQr').mockImplementation(mockedDelete)
  return { mockedDelete }
}

export function mockToggleEnabled(response?: TypeQrToggleEnabledResponse) {
  const result = response ?? generateToggleResponse()
  const mockedToggle = vi.fn().mockResolvedValue(result)
  vi.spyOn(ApiClientQr, 'toggleQrEnabled').mockImplementation(mockedToggle)
  return { mockedToggle, response: result }
}

export function mockUpdateTarget(response?: TypeQrTargetUrlResponse) {
  const result = response ?? generateTargetUrlResponse()
  const mockedUpdate = vi.fn().mockResolvedValue(result)
  vi.spyOn(ApiClientQr, 'updateTargetUrl').mockImplementation(mockedUpdate)
  return { mockedUpdate, response: result }
}

export function mockGetScanLogs(stats?: TypeQrScanStatsResponse) {
  const result = stats ?? generateScanStats()
  const mockedStats = vi.fn().mockResolvedValue(result)
  vi.spyOn(ApiClientQr, 'getScanLogs').mockImplementation(mockedStats)
  return { mockedStats, stats: result }
}
