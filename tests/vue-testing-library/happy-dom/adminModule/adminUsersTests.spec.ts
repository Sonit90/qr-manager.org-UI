import { visitRoute } from '../../helpers/visitRoute.ts'
import { waitFor, within } from '@testing-library/vue'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import {
  mockAdminUsers,
  mockAdminDeleteUser,
  mockAdminGetUserById,
  mockAdminCreateUser,
  mockAdminUpdateUser,
} from '@tests/__apiMocks__/admin/mockAdminUsers.ts'
import { mockUser } from '@tests/__apiMocks__/user/mockUser.ts'
import { flushPromises } from '@vue/test-utils'
import { mockWithDelay } from '@tests/helpers/mockWithDelay.ts'

mockUser({ role: 'admin' })

describe('AdminUsers Integration Tests', () => {
  test('should render admin users page with user table', async () => {
    const { users } = mockAdminUsers()

    const { view } = await visitRoute('/admin/users')

    // Check if page title is displayed
    view.getByText('All users')

    // Check if create user button is displayed
    view.getByText('Create User')

    // Wait for users table to be populated
    // Check if table headers are displayed
    view.getByText('Email')
    view.getByText('Full name')
    view.getByText('Role')
    view.getByText('Is Active')
    view.getByText('Is Superuser')

    await flushPromises()
    // Check if user data is displayed
    for (const user of users) {
      view.getByText(user.email)
      if (user.full_name) {
        view.getByText(user.full_name)
      }
    }
  })

  test('should open create user form when clicking create button', async () => {
    mockAdminUsers()

    const { view, user } = await visitRoute('/admin/users')

    // Click create user button
    await user.click(view.getByRole('button', { name: 'Create User' }))

    view.getByLabelText('Email')
    view.getByLabelText('Full Name')
    view.getByLabelText('Password')
    view.getByLabelText('Role')
    view.getByLabelText('Is Active')
    view.getByLabelText('Is Super user')
  })

  test('should create a new user successfully', async () => {
    mockAdminUsers()
    const { mockedCreateUser } = mockAdminCreateUser()
    const { mockedGetAllUsers } = mockAdminUsers()

    const { view, user } = await visitRoute('/admin/users')

    // Click create user button
    await user.click(view.getByRole('button', { name: 'Create User' }))

    // Fill the user form
    await user.type(view.getByLabelText('Email'), 'newuser@example.com')
    await user.type(view.getByLabelText('Full Name'), 'New User')
    await user.type(view.getByLabelText('Password'), 'password123')

    const form = view.getByTestId('user-form')

    const createBtn = within(form).getByRole('button', { name: /create user/i })
    await user.click(createBtn)

    // Check if API was called with correct data
    await waitFor(() => {
      expect(mockedCreateUser).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        full_name: 'New User',
        password: 'password123',
        confirm_password: 'password123',
        is_active: true,
        is_superuser: false,
        role: 'readonly',
      })
    })

    // Check if users were fetched again
    await waitFor(() => {
      expect(mockedGetAllUsers).toHaveBeenCalledTimes(2) // Initial load + after creation
    })
  })

  test('should edit an existing user', async () => {
    const { users } = mockAdminUsers()
    const { mockedUpdateUser } = mockAdminUpdateUser()
    const { mockedGetUserById } = mockAdminGetUserById()

    const { view, user } = await visitRoute('/admin/users')

    await flushPromises()
    // Wait for users to load
    view.getByText(users[0].email)

    // Find and click edit button for the first user
    const editButtons = view.getAllByTitle('Edit')
    await user.click(editButtons[0])

    // Check if user form dialog is displayed with user data
    await waitFor(() => {
      view.getByText('Edit User')
    })

    // Modify user data
    const fullNameInput = view.getByLabelText('Full Name')
    await user.clear(fullNameInput)
    await user.type(fullNameInput, 'Updated Name')
    await user.type(view.getByLabelText('Password'), 'password123')

    // Submit the form
    await user.click(view.getByText('Update User'))

    // Check if API was called to update user
    await waitFor(() => {
      expect(mockedUpdateUser).toHaveBeenCalled()
      expect(mockedGetUserById).toHaveBeenCalled()
    })
  })

  test('should delete a user after confirmation', async () => {
    const { users } = mockAdminUsers()
    const { mockedDeleteUser } = mockAdminDeleteUser()

    // Mock window.confirm to return true
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    const { view, user } = await visitRoute('/admin/users')

    // Wait for users to load
    await waitFor(() => {
      view.getByText(users[0].email)
    })

    // Find and click delete button for the first user
    const deleteButtons = view.getAllByTitle('Delete')
    await user.click(deleteButtons[0])

    // Check if confirmation was requested
    expect(confirmSpy).toHaveBeenCalled()

    // Check if API was called to delete user
    await waitFor(() => {
      expect(mockedDeleteUser).toHaveBeenCalledWith(users[0].id)
    })

    // Restore the original implementation
    confirmSpy.mockRestore()
  })

  test('should not delete a user when confirmation is canceled', async () => {
    const { users } = mockAdminUsers()
    const { mockedDeleteUser } = mockAdminDeleteUser()

    // Mock window.confirm to return false
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)

    const { view, user } = await visitRoute('/admin/users')

    // Wait for users to load
    await waitFor(() => {
      view.getByText(users[0].email)
    })

    // Find and click delete button for the first user
    const deleteButtons = view.getAllByTitle('Delete')
    await user.click(deleteButtons[0])

    // Check if confirmation was requested
    expect(confirmSpy).toHaveBeenCalled()

    // Check that API was not called to delete user
    expect(mockedDeleteUser).not.toHaveBeenCalled()

    // Restore the original implementation
    confirmSpy.mockRestore()
  })

  test('should cancel user form when clicking cancel button', async () => {
    mockAdminUsers()

    const { view, user } = await visitRoute('/admin/users')

    // Click create user button
    await user.click(view.getByRole('button', { name: 'Create User' }))

    const form = view.getByTestId('user-form')

    const createBtn = within(form).getByRole('button', { name: /create user/i })
    await user.click(createBtn)

    // Click cancel button
    await user.click(within(form).getByRole('button', { name: 'Cancel' }))

    // Check if form is closed
    await waitFor(() => {
      expect(view.queryByText('Create User Form')).not.toBeInTheDocument()
    })
  })

  test('should show loading state while fetching users', async () => {
    // Delay the API response to show loading state
    const mockedRequest = mockWithDelay({ data: [], total: 0 }, 100)

    vi.spyOn(ApiClientV1, 'adminGetAllUsers').mockImplementation(mockedRequest)

    const { view } = await visitRoute('/admin/users')

    // Check if loading state is shown
    view.getByRole('progressbar')

    // Wait for loading to complete
    await waitFor(() => {
      expect(view.queryByRole('progressbar')).not.toBeInTheDocument()
    })
  })

  test('should disable delete button when deletion is in progress', async () => {
    const { users } = mockAdminUsers()

    const mockedRequest = mockWithDelay({ message: 'User deleted' }, 100)
    // Delay the delete API call
    vi.spyOn(ApiClientV1, 'adminDeleteUser').mockImplementation(mockedRequest)

    // Mock window.confirm to return true
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    const { view, user } = await visitRoute('/admin/users')

    // Wait for users to load
    await waitFor(() => {
      view.getByText(users[0].email)
    })

    // Find and click delete button for the first user
    const deleteButtons = view.getAllByTitle('Delete')
    await user.click(deleteButtons[0])

    // Check if delete button is disabled during deletion
    await waitFor(() => {
      const deleteButton = view.getAllByTitle('Delete')[0]
      expect(deleteButton).toBeDisabled()
    })

    // Wait for deletion to complete and check if button is enabled again
    await waitFor(() => {
      const deleteButton = view.getAllByTitle('Delete')[0]
      expect(deleteButton).not.toBeDisabled()
    })

    // Restore the original implementation
    confirmSpy.mockRestore()
  })
})
