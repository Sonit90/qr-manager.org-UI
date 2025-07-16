import { faker } from '@faker-js/faker'

/**
 * Generate a valid activation token
 */
export function generateValidActivationToken(): string {
  return faker.string.alphanumeric({ length: 64 })
}

/**
 * Generate an invalid activation token (too short)
 */
export function generateInvalidActivationToken(): string {
  return faker.string.alphanumeric({ length: 10 })
}

/**
 * Generate activation URL parameters
 */
export function generateActivationParams(token?: string) {
  return {
    token: token || generateValidActivationToken(),
    email: faker.internet.email(),
    userId: faker.string.uuid(),
  }
}

/**
 * Generate activation URL with token
 */
export function generateActivationUrl(token?: string): string {
  const activationToken = token || generateValidActivationToken()
  return `/activate?token=${activationToken}`
}

/**
 * Generate activation URL without token
 */
export function generateActivationUrlWithoutToken(): string {
  return '/activate'
}
