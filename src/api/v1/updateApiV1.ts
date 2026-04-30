import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const SCHEMA_URL = 'http://localhost:8080/api/docs/openapi.json'
const SCHEMA_PATH = resolve(import.meta.dir, 'openapi.json')

console.log(`Fetching ${SCHEMA_URL}...`)

const response = await fetch(SCHEMA_URL)

if (!response.ok) {
  console.error(`Failed: ${response.status} ${response.statusText}`)
  process.exit(1)
}

writeFileSync(SCHEMA_PATH, JSON.stringify(await response.json(), null, 2))
console.log(`Saved to ${SCHEMA_PATH}`)

const result = spawnSync('bun', ['run', 'generate-api-v1'], { stdio: 'inherit' })
process.exit(result.status ?? 0)
