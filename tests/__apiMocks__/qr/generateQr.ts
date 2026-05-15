import { faker } from '@faker-js/faker'
import type {
  TypeQrQrCodeResponse,
  TypeQrScanLogResponse,
  TypeQrScanStatsResponse,
  TypeQrToggleEnabledResponse,
  TypeQrTargetUrlResponse,
} from '@/api/__generated__/qr/data-contracts.ts'

export function generateQr(overrides: Partial<TypeQrQrCodeResponse> = {}): TypeQrQrCodeResponse {
  return {
    id: faker.string.uuid(),
    code: faker.string.alphanumeric(8),
    target_url: faker.internet.url(),
    enabled: true,
    scan_count: faker.number.int({ min: 0, max: 1000 }),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    image_url: faker.image.urlPicsumPhotos(),
    name: faker.datatype.boolean() ? faker.commerce.productName() : null,
    ...overrides,
  }
}

export function generateScanLog(
  overrides: Partial<TypeQrScanLogResponse> = {},
): TypeQrScanLogResponse {
  return {
    timestamp: faker.date.recent().toISOString(),
    ip: faker.internet.ipv4(),
    device_type: faker.helpers.arrayElement(['desktop', 'mobile', 'tablet']),
    browser: faker.helpers.arrayElement(['Chrome', 'Firefox', 'Safari']),
    ...overrides,
  }
}

export function generateScanStats(
  overrides: Partial<TypeQrScanStatsResponse> = {},
): TypeQrScanStatsResponse {
  return {
    total_scans: faker.number.int({ min: 0, max: 500 }),
    device_breakdown: { desktop: 10, mobile: 5 },
    browser_breakdown: { Chrome: 8, Firefox: 7 },
    recent_logs: Array.from({ length: 3 }, () => generateScanLog()),
    ...overrides,
  }
}

export function generateToggleResponse(
  overrides: Partial<TypeQrToggleEnabledResponse> = {},
): TypeQrToggleEnabledResponse {
  return {
    id: faker.string.uuid(),
    enabled: true,
    updated_at: faker.date.recent().toISOString(),
    ...overrides,
  }
}

export function generateTargetUrlResponse(
  overrides: Partial<TypeQrTargetUrlResponse> = {},
): TypeQrTargetUrlResponse {
  return {
    id: faker.string.uuid(),
    url: faker.internet.url(),
    created_at: faker.date.recent().toISOString(),
    ...overrides,
  }
}
