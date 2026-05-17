import { visitRoute } from '../../helpers/visitRoute.ts'
import { waitFor } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { mockUser } from '@tests/__apiMocks__/user/mockUser.ts'
import {
  mockListQrs,
  mockGetQr,
  mockGetScanLogs,
  mockDeleteQr,
} from '@tests/__apiMocks__/qr/mockQr.ts'
import { generateQr } from '@tests/__apiMocks__/qr/generateQr.ts'

mockUser()

describe('QR Delete Integration Tests', () => {
  test('should delete QR from list after user confirms in modal', async () => {
    const qr = generateQr()
    mockListQrs([qr])
    const { mockedDelete } = mockDeleteQr()

    const { view, user } = await visitRoute('/qrs')

    await flushPromises()

    await user.click(view.getByTestId('qr-delete'))

    await waitFor(() => view.getByTestId('confirm-accept'))

    await user.click(view.getByTestId('confirm-accept'))

    await waitFor(() => {
      expect(mockedDelete).toHaveBeenCalledWith(qr.id)
    })
  })

  test('should not delete QR from list when user cancels modal', async () => {
    const qr = generateQr()
    mockListQrs([qr])
    const { mockedDelete } = mockDeleteQr()

    const { view, user } = await visitRoute('/qrs')

    await flushPromises()

    await user.click(view.getByTestId('qr-delete'))

    await waitFor(() => view.getByTestId('confirm-cancel'))

    await user.click(view.getByTestId('confirm-cancel'))

    await flushPromises()

    expect(mockedDelete).not.toHaveBeenCalled()
  })

  test('should remove deleted QR from rendered list', async () => {
    const remaining = generateQr({ name: 'Keep Me' })
    const target = generateQr({ name: 'Delete Me' })
    mockListQrs([remaining, target])
    mockDeleteQr()

    const { view, user } = await visitRoute('/qrs')

    await flushPromises()

    const deleteButtons = view.getAllByTestId('qr-delete')
    await user.click(deleteButtons[1])

    await waitFor(() => view.getByTestId('confirm-accept'))
    await user.click(view.getByTestId('confirm-accept'))

    await waitFor(() => {
      expect(view.queryByText('Delete Me')).not.toBeInTheDocument()
    })
    view.getByText('Keep Me')
  })

  test('should delete QR from detail page after modal confirm', async () => {
    const qr = generateQr()
    mockGetQr(qr)
    mockGetScanLogs()
    mockListQrs([])
    const { mockedDelete } = mockDeleteQr()

    const { view, user } = await visitRoute(`/qrs/${qr.id}`)

    await flushPromises()

    await user.click(view.getByTestId('qr-detail-delete'))

    await waitFor(() => view.getByTestId('confirm-accept'))
    await user.click(view.getByTestId('confirm-accept'))

    await waitFor(() => {
      expect(mockedDelete).toHaveBeenCalledWith(qr.id)
    })
  })

  test('should not delete QR from detail page when modal cancelled', async () => {
    const qr = generateQr()
    mockGetQr(qr)
    mockGetScanLogs()
    const { mockedDelete } = mockDeleteQr()

    const { view, user } = await visitRoute(`/qrs/${qr.id}`)

    await flushPromises()

    await user.click(view.getByTestId('qr-detail-delete'))

    await waitFor(() => view.getByTestId('confirm-cancel'))
    await user.click(view.getByTestId('confirm-cancel'))

    await flushPromises()

    expect(mockedDelete).not.toHaveBeenCalled()
  })
})
