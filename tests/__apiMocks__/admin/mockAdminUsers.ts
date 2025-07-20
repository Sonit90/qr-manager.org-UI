import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import type { TypeUserPublicV1 } from '@/api/__generated__/v1/data-contracts.ts'
import { generateUser } from '../user/generateUser.ts'

export function mockAdminUsers(count = 5) {
  const users = Array.from({ length: count }, () => generateUser())
  const response = { data: users, total: users.length }
  const mockedGetAllUsers = vi.fn().mockResolvedValue(response)
  vi.spyOn(ApiClientV1, 'adminGetAllUsers').mockImplementation(mockedGetAllUsers)
  return { mockedGetAllUsers, users, response }
}

export function mockAdminDeleteUser() {
  const response = { message: 'User deleted successfully' }
  const mockedDeleteUser = vi.fn().mockResolvedValue(response)
  vi.spyOn(ApiClientV1, 'adminDeleteUser').mockImplementation(mockedDeleteUser)
  return { mockedDeleteUser, response }
}

export function mockAdminGetUserById(user?: TypeUserPublicV1) {
  const userData = user || generateUser()
  const mockedGetUserById = vi.fn().mockResolvedValue(userData)
  vi.spyOn(ApiClientV1, 'adminGetUserById').mockImplementation(mockedGetUserById)
  return { mockedGetUserById, user: userData }
}

export function mockAdminCreateUser() {
  const newUser = generateUser()
  const mockedCreateUser = vi.fn().mockResolvedValue(newUser)
  vi.spyOn(ApiClientV1, 'adminCreateUser').mockImplementation(mockedCreateUser)
  return { mockedCreateUser, newUser }
}

export function mockAdminUpdateUser() {
  const updatedUser = generateUser()
  const mockedUpdateUser = vi.fn().mockResolvedValue(updatedUser)
  vi.spyOn(ApiClientV1, 'adminUpdateUser').mockImplementation(mockedUpdateUser)
  return { mockedUpdateUser, updatedUser }
}
