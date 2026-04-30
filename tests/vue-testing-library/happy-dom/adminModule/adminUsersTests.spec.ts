import { visitRoute } from '../../helpers/visitRoute.ts'
import { waitFor, within } from '@testing-library/vue'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import {
  mockListUsers,
  mockSetActive,
  mockSetRole,
} from '@tests/__apiMocks__/admin/mockAdminUsers.ts'
import { mockUser } from '@tests/__apiMocks__/user/mockUser.ts'
import { generateUser } from '@tests/__apiMocks__/user/generateUser.ts'
import { flushPromises } from '@vue/test-utils'
import { mockWithDelay } from '@tests/helpers/mockWithDelay.ts'
import { TypeRoleV1, type TypeUserV1 } from '@/api/__generated__/v1/data-contracts.ts'

mockUser({ role: TypeRoleV1.EnumAdmin })

describe('AdminUsers Integration Tests', () => {
  test('should render admin users page with table headers', async () => {
    mockListUsers()

    const { view } = await visitRoute('/admin/users')

    view.getByText('All users')
    view.getByText('Email')
    view.getByText('Display Name')
    view.getByText('Role')
    view.getByText('Is Active')
  })

  test('should call listUsers on page load', async () => {
    const { mockedListUsers } = mockListUsers()

    await visitRoute('/admin/users')

    expect(mockedListUsers).toHaveBeenCalledWith({})
  })

  test('should display users from API in table', async () => {
    const { users } = mockListUsers(3)

    const { view } = await visitRoute('/admin/users')

    await flushPromises()

    for (const user of users) {
      if (user.email) view.getByText(user.email)
    }
  })

  test('should open edit form when clicking edit button', async () => {
    const testUser = generateUser({ email: 'target@example.com', role: TypeRoleV1.EnumUser })
    vi.spyOn(ApiClientV1, 'listUsers').mockResolvedValue([testUser])

    const { view, user } = await visitRoute('/admin/users')

    await flushPromises()

    await user.click(view.getByTitle('Edit'))

    const form = view.getByTestId('user-form')
    within(form).getByLabelText('Role')
    within(form).getByLabelText('Is Active')
    within(form).getByText('target@example.com')
  })

  test('should call setRole when role changes', async () => {
    const testUser = generateUser({ role: TypeRoleV1.EnumUser })
    vi.spyOn(ApiClientV1, 'listUsers').mockResolvedValue([testUser])
    const { mockedSetRole } = mockSetRole()

    const { view, user } = await visitRoute('/admin/users')

    await flushPromises()

    await user.click(view.getByTitle('Edit'))

    const roleSelect = view.getByLabelText('Role')
    await user.click(roleSelect)

    await waitFor(() => view.getByRole('option', { name: 'Admin' }))
    await user.click(view.getByRole('option', { name: 'Admin' }))

    await user.click(view.getByRole('button', { name: 'Update User' }))

    await waitFor(() => {
      expect(mockedSetRole).toHaveBeenCalledWith(testUser.id, { role: TypeRoleV1.EnumAdmin })
    })
  })

  test('should call setActive when active status is toggled', async () => {
    const testUser = generateUser({ is_active: true })
    vi.spyOn(ApiClientV1, 'listUsers').mockResolvedValue([testUser])
    const { mockedSetActive } = mockSetActive()

    const { view, user } = await visitRoute('/admin/users')

    await flushPromises()

    await user.click(view.getByTitle('Edit'))

    await user.click(view.getByLabelText('Is Active'))

    await user.click(view.getByRole('button', { name: 'Update User' }))

    await waitFor(() => {
      expect(mockedSetActive).toHaveBeenCalledWith(testUser.id, { active: false })
    })
  })

  test('should close edit form when cancel is clicked', async () => {
    const testUser = generateUser()
    vi.spyOn(ApiClientV1, 'listUsers').mockResolvedValue([testUser])

    const { view, user } = await visitRoute('/admin/users')

    await flushPromises()

    await user.click(view.getByTitle('Edit'))

    view.getByTestId('user-form')

    await user.click(view.getByRole('button', { name: 'Cancel' }))

    await waitFor(() => {
      expect(view.queryByTestId('user-form')).not.toBeInTheDocument()
    })
  })

  test('should show loading state while fetching users', async () => {
    const mockedRequest = mockWithDelay<TypeUserV1[]>([], 100)
    vi.spyOn(ApiClientV1, 'listUsers').mockImplementation(mockedRequest)

    const { view } = await visitRoute('/admin/users')

    view.getByRole('progressbar')

    await waitFor(() => {
      expect(view.queryByRole('progressbar')).not.toBeInTheDocument()
    })
  })
})
