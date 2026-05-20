import { waitFor } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { ApiClientQr } from '@/api/qr/ApiClientQr.ts'
import { mockGetQr, mockGetScanLogs } from '@tests/__apiMocks__/qr/mockQr.ts'
import { generateQr } from '@tests/__apiMocks__/qr/generateQr.ts'
import { visitRoute } from '../../../helpers/visitRoute.ts'

export function mockExportQr() {
  const blob = new Blob(['content'], { type: 'image/svg+xml' })
  const mockedExport = vi.fn().mockResolvedValue(blob)
  vi.spyOn(ApiClientQr, 'exportQr').mockImplementation(mockedExport)
  return { mockedExport }
}

export async function openExportModalFromDetailPage(qr = generateQr()) {
  mockGetQr(qr)
  mockGetScanLogs()
  const { view, user } = await visitRoute(`/qrs/${qr.id}`)
  await flushPromises()
  await user.click(view.getByRole('button', { name: /export/i }))
  await waitFor(() => view.getByRole('button', { name: /download/i }))
  return { view, user, qr }
}
