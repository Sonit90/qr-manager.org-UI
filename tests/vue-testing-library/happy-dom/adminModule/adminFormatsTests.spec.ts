import { visitRoute } from '../../helpers/visitRoute.ts'
import { waitFor } from '@testing-library/vue'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import {
  mockListFormats,
  mockDeleteFormat,
} from '@tests/__apiMocks__/admin/mockAdminFormats.ts'
import { mockUser } from '@tests/__apiMocks__/user/mockUser.ts'
import { flushPromises } from '@vue/test-utils'
import { mockWithDelay } from '@tests/helpers/mockWithDelay.ts'
import {
  TypeRoleV1,
  type TypeOutputFormatV1,
} from '@/api/__generated__/v1/data-contracts.ts'

mockUser({ role: TypeRoleV1.EnumAdmin })

describe('AdminFormats Integration Tests', () => {
  test('should render formats list page', async () => {
    mockListFormats()

    const { view } = await visitRoute('/formats')

    view.getByRole('heading', { name: 'Output Formats' })
    view.getByRole('button', { name: 'New format' })
    view.getByText('Filename')
    view.getByText('Description')
    view.getByText('Extension')
  })

  test('should call listFormats on page load', async () => {
    const { mockedListFormats } = mockListFormats()

    await visitRoute('/formats')

    expect(mockedListFormats).toHaveBeenCalled()
  })

  test('should display formats from API', async () => {
    const { formats } = mockListFormats(2)

    const { view } = await visitRoute('/formats')

    await flushPromises()

    for (const f of formats) {
      if (f.filename) view.getByText(f.filename)
    }
  })

  test('should call deleteFormat after confirmation', async () => {
    const { formats } = mockListFormats(1)
    const { mockedDeleteFormat } = mockDeleteFormat()

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    const { view, user } = await visitRoute('/formats')

    await flushPromises()

    await user.click(view.getByTitle('Delete'))

    expect(confirmSpy).toHaveBeenCalled()

    await waitFor(() => {
      expect(mockedDeleteFormat).toHaveBeenCalledWith(formats[0].id)
    })

    confirmSpy.mockRestore()
  })

  test('should not call deleteFormat when confirmation cancelled', async () => {
    mockListFormats(1)
    const { mockedDeleteFormat } = mockDeleteFormat()

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)

    const { view, user } = await visitRoute('/formats')

    await flushPromises()

    await user.click(view.getByTitle('Delete'))

    expect(confirmSpy).toHaveBeenCalled()
    expect(mockedDeleteFormat).not.toHaveBeenCalled()

    confirmSpy.mockRestore()
  })

  test('should navigate to detail page when view clicked', async () => {
    const { formats } = mockListFormats(1)

    const { view, user } = await visitRoute('/formats')

    await flushPromises()

    await user.click(view.getByTitle('View'))

    await waitFor(() => {
      expect(window.location.pathname).toBe(`/formats/${formats[0].id}`)
    })
  })

  test('should navigate to create page when New format clicked', async () => {
    mockListFormats()

    const { view, user } = await visitRoute('/formats')

    await user.click(view.getByRole('button', { name: 'New format' }))

    await waitFor(() => {
      expect(window.location.pathname).toBe('/formats/new')
    })
  })

  test('should show loading state while fetching formats', async () => {
    const mockedRequest = mockWithDelay<TypeOutputFormatV1[]>([], 100)
    vi.spyOn(ApiClientV1, 'listFormats').mockImplementation(mockedRequest)

    const { view } = await visitRoute('/formats')

    view.getByRole('progressbar')

    await waitFor(() => {
      expect(view.queryByRole('progressbar')).not.toBeInTheDocument()
    })
  })
})
