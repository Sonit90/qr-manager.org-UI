import { faker } from '@faker-js/faker'
import { TypeRoleV1, type TypeUserV1 } from '@/api/__generated__/v1/data-contracts.ts'

export function generateUser(overrides: Partial<TypeUserV1> = {}): TypeUserV1 {
  return {
    created_at: faker.date.past().toISOString(),
    email: faker.internet.email(),
    display_name: faker.datatype.boolean() ? faker.person.fullName() : null,
    id: faker.string.uuid(),
    is_active: true,
    role: TypeRoleV1.EnumUser,
    updated_at: faker.date.recent().toISOString(),
    email_verified: faker.datatype.boolean(),
    ...overrides,
  }
}
