import { within } from '@testing-library/vue'
import { visitRoute } from '../../helpers/visitRoute.ts'
import { faker } from '@faker-js/faker'
import { mockUser } from '@tests/__apiMocks__/user/mockUser.ts'
import { mockUpdateUser } from '@tests/__apiMocks__/user/mockUpdateUser.ts'

describe('UserPage', () => {
  test('should fetch user info from the backend', async () => {
    const { mockedUser, userResponse } = mockUser()

    const { view } = await visitRoute('/user')

    expect(mockedUser).toHaveBeenCalled()

    // Check if user info is displayed
    const userInfoContainer = view.getByTestId('user-page-edit-form')
    if (userResponse.full_name) {
      within(userInfoContainer).getByText(userResponse.full_name)
    }
    within(userInfoContainer).getByText(userResponse.email)
    within(userInfoContainer).getByText(userResponse.role as string)
  })

  test('should allow user to edit their name', async () => {
    const originalName = faker.person.fullName()
    const { userResponse } = mockUser({ full_name: originalName })

    const newName = faker.person.fullName()

    const { mockedUpdateUser } = mockUpdateUser({
      ...userResponse,
      full_name: newName,
      updated_at: new Date().toISOString(),
    })

    // Visit the user page
    const { view, user } = await visitRoute('/user')

    const userInfoContainer = view.getByTestId('user-page-edit-form')
    within(userInfoContainer).getByText(originalName)

    await user.click(view.getByTestId('edit-user-button'))

    // Find the name input field and change the value
    const nameInput = view.getByDisplayValue(originalName)

    await user.clear(nameInput)
    await user.type(nameInput, newName)

    // Click the save button
    await user.click(view.getByTestId('save-edit-button'))

    // Verify the API call was made with the correct parameters
    expect(mockedUpdateUser).toHaveBeenCalledWith({ full_name: newName })
  })

  test('should display original name when editing is cancelled', async () => {
    const originalName = faker.person.fullName()
    const { userResponse } = mockUser({ full_name: originalName })
    const newName = faker.person.fullName()

    const { mockedUpdateUser } = mockUpdateUser(userResponse)

    const { view, user } = await visitRoute('/user')

    const userInfoContainer = view.getByTestId('user-info-container')
    within(userInfoContainer).getByText(originalName)

    await user.click(view.getByTestId('edit-user-button'))

    // Find the name input field and change the value
    const nameInput = view.getByDisplayValue(originalName)
    await user.clear(nameInput)
    await user.type(nameInput, newName)

    await user.click(view.getByTestId('cancel-edit-button'))

    within(userInfoContainer).getByText(originalName)

    expect(mockedUpdateUser).not.toHaveBeenCalled()
  })

  test('should handle edge case when user does not have a name', async () => {
    // Mock the user API response without a name
    const { userResponse } = mockUser({ full_name: null })
    const newName = faker.person.fullName()

    const { mockedUpdateUser } = mockUpdateUser({
      ...userResponse,
      full_name: newName,
      updated_at: new Date().toISOString(),
    })

    const { view, user } = await visitRoute('/user')

    const userInfoContainer = view.getByTestId('user-info-container')
    within(userInfoContainer).getByText(userResponse.email)

    await user.click(view.getByTestId('edit-user-button'))

    // Find the name input field and add a name
    const nameInput = view.getByDisplayValue('')
    await user.type(nameInput, newName)

    await user.click(view.getByTestId('save-edit-button'))

    expect(mockedUpdateUser).toHaveBeenCalledWith({ full_name: newName })
  })
})
