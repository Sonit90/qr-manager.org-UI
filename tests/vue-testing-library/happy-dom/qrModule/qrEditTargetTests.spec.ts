import { visitRoute } from '../../helpers/visitRoute.ts'
import { waitFor } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { faker } from '@faker-js/faker'
import { mockUser } from '@tests/__apiMocks__/user/mockUser.ts'
import { mockListQrs, mockUpdateTarget } from '@tests/__apiMocks__/qr/mockQr.ts'
import { generateQr } from '@tests/__apiMocks__/qr/generateQr.ts'

mockUser()

describe('QR Edit Target URL Integration Tests', () => {
  test('should open edit dialog prefilled with current target URL', async () => {
    const currentUrl = faker.internet.url()
    const qr = generateQr({ target_url: currentUrl, name: 'My QR' })
    mockListQrs([qr])

    const { view, user } = await visitRoute('/qrs')

    await flushPromises()

    await user.click(view.getByTestId('qr-edit-target'))

    await waitFor(() => {
      expect(view.getByLabelText('Target URL')).toHaveValue(currentUrl)
    })
  })

  test('should call updateTargetUrl with new url when saved', async () => {
    const newUrl = faker.internet.url()
    const qr = generateQr({ target_url: faker.internet.url(), name: 'My QR' })
    mockListQrs([qr])
    const { mockedUpdate } = mockUpdateTarget({
      id: qr.id,
      url: newUrl,
      created_at: faker.date.recent().toISOString(),
    })

    const { view, user } = await visitRoute('/qrs')

    await flushPromises()

    await user.click(view.getByTestId('qr-edit-target'))

    await waitFor(() => view.getByLabelText('Target URL'))

    await user.clear(view.getByLabelText('Target URL'))
    await user.type(view.getByLabelText('Target URL'), newUrl)

    await user.click(view.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(mockedUpdate).toHaveBeenCalledWith(qr.id, { url: newUrl })
    })
  })

  test('should show validation error and not call API for invalid URL', async () => {
    const qr = generateQr({ target_url: faker.internet.url(), name: 'My QR' })
    mockListQrs([qr])
    const { mockedUpdate } = mockUpdateTarget()

    const { view, user } = await visitRoute('/qrs')

    await flushPromises()

    await user.click(view.getByTestId('qr-edit-target'))

    await waitFor(() => view.getByLabelText('Target URL'))

    await user.clear(view.getByLabelText('Target URL'))
    await user.type(view.getByLabelText('Target URL'), 'not-a-url')

    await user.click(view.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      view.getByText('Must be a valid URL')
    })
    expect(mockedUpdate).not.toHaveBeenCalled()
  })
})
