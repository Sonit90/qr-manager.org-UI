import { faker } from '@faker-js/faker'

/**
 * Generate a valid email address
 */
export function generateValidEmail(): string {
  return faker.internet.email()
}

/**
 * Generate an invalid email address
 */
export function generateInvalidEmail(): string {
  return faker.lorem.word()
}

/**
 * Generate a valid password reset token
 */
export function generateValidResetToken(): string {
  return faker.string.alphanumeric({ length: 64 })
}

/**
 * Generate a valid password
 */
export function generateValidPassword(): string {
  return faker.internet.password({ length: 10, memorable: true, prefix: '123' })
}

/**
 * Generate a weak password (too short)
 */
export function generateWeakPassword(): string {
  return faker.internet.password({ length: 4 })
}

/**
 * Generate URL parameters for password reset
 */
export function generateResetUrlParams(token: string = generateValidResetToken()): URLSearchParams {
  const params = new URLSearchParams()
  params.set('token', token)
  return params
}
