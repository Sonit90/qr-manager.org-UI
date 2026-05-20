import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import { generateUser } from '../user/generateUser.ts'

export function mockListUsers(count = 5) {
  const users = Array.from({ length: count }, () => generateUser())
  const mockedListUsers = vi.fn().mockResolvedValue(users)
  vi.spyOn(ApiClientV1, 'listUsers').mockImplementation(mockedListUsers)
  return { mockedListUsers, users }
}

export function mockSetActive() {
  const mockedSetActive = vi.fn()
  vi.spyOn(ApiClientV1, 'setActive').mockImplementation(mockedSetActive)
  return { mockedSetActive }
}

export function mockSetRole() {
  const mockedSetRole = vi.fn()
  vi.spyOn(ApiClientV1, 'setRole').mockImplementation(mockedSetRole)
  return { mockedSetRole }
}

export function mockGrantPermission() {
  const mockedGrantPermission = vi.fn()
  vi.spyOn(ApiClientV1, 'grantPermission').mockImplementation(mockedGrantPermission)
  return { mockedGrantPermission }
}
