import { within, waitFor } from '@testing-library/vue'
import { faker } from '@faker-js/faker'
import { visitRoute } from '../../helpers/visitRoute.ts'
import { mockUser } from '@tests/__apiMocks__/user/mockUser.ts'

function generateAccessToken() {
  return faker.string.alphanumeric(32)
}

describe('UserPage', () => {
  beforeEach(() => {
    localStorage.setItem('access_token', JSON.stringify(generateAccessToken()))
    localStorage.setItem('refresh_token', JSON.stringify(generateAccessToken()))
  })

  afterEach(() => {
    localStorage.clear()
  })

  test('should fetch user info from the backend', async () => {
    const { mockedUser, userResponse } = mockUser()

    const { view } = await visitRoute('/profile')

    await waitFor(() => {
      expect(mockedUser).toHaveBeenCalled()
    })

    const userInfoContainer = view.getByTestId('user-info-container')
    if (userResponse.display_name) {
      within(userInfoContainer).getByText(userResponse.display_name)
    }
    if (userResponse.email) {
      within(userInfoContainer).getByText(userResponse.email)
    }
    within(userInfoContainer).getByText(userResponse.role as string)
  })
})
