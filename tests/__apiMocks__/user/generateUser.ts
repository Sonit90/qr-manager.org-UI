import { faker } from '@faker-js/faker'
import type { TypeUserPublicV1 } from 'src/api/__generated__/v1/data-contracts.ts'

export function generateUser(): TypeUserPublicV1 {
  return {
    created_at: faker.date.past().toISOString(),
    deleted_at: null,
    email: faker.internet.email(),
    full_name: faker.datatype.boolean() ? faker.person.fullName() : null,
    id: faker.string.uuid(),
    is_active: true,
    is_superuser: false,
    role: faker.helpers.arrayElement(['readonly', 'admin', 'editor', 'user']),
    updated_at: faker.date.recent().toISOString(),
  }
}
