import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

type Target = 'v1' | 'qr'

const TARGETS: Record<Target, { url: string; outDir: string; generateScript: string }> = {
  v1: {
    url: import.meta.env.VITE_API_URL,
    outDir: 'src/api/v1',
    generateScript: 'generate-api-v1',
  },
  qr: {
    url: import.meta.env.VITE_QR_API_URL,
    outDir: 'src/api/qr',
    generateScript: 'generate-api-qr',
  },
}

const target = process.argv[2] as Target
const config = TARGETS[target]

if (!config) {
  console.error(`Unknown target "${target}". Use one of: ${Object.keys(TARGETS).join(', ')}`)
  process.exit(1)
}

const SCHEMA_URL = `${config.url}/api/docs/openapi.json`
const SCHEMA_PATH = resolve(process.cwd(), config.outDir, 'openapi.json')

console.log(`Fetching ${SCHEMA_URL}...`)

const response = await fetch(SCHEMA_URL)

if (!response.ok) {
  console.error(`Failed: ${response.status} ${response.statusText}`)
  process.exit(1)
}

writeFileSync(SCHEMA_PATH, JSON.stringify(await response.json(), null, 2))
console.log(`Saved to ${SCHEMA_PATH}`)

const result = spawnSync('bun', ['run', config.generateScript], { stdio: 'inherit' })
process.exit(result.status ?? 0)
