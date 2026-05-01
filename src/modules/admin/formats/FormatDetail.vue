<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type {
  TypeColumnTypeV1,
  TypeOutputFormatV1,
  TypeOutputStepV1,
} from '@/api/__generated__/v1/data-contracts.ts'
import { useAdminFormats } from '@/modules/admin/formats/composables/useAdminFormats.ts'
import { type Expr, renderExprText } from '@/modules/admin/formats/types.ts'

const route = useRoute()
const router = useRouter()
const { fetchFormat, deleteFormat, deleteId } = useAdminFormats()

const format = ref<TypeOutputFormatV1 | null>(null)
const loading = ref(false)

const formatId = computed(() => String(route.params.id))

onMounted(async () => {
  loading.value = true
  format.value = await fetchFormat(formatId.value)
  loading.value = false
})

function describeColType(t: TypeColumnTypeV1 | undefined): string {
  if (!t) return 'string'
  if (t.kind === 'datetime') {
    if (t.format.type === 'custom') return `datetime (${t.format.pattern})`
    return `datetime (${t.format.type})`
  }
  return t.kind
}

function stepHeader(step: TypeOutputStepV1): string {
  const word = step.kind === 'filters' ? 'Filters' : 'Transforms'
  return `${word} (${step.items.length})`
}

async function onDelete() {
  if (!format.value) return
  const label = format.value.filename || format.value.id
  if (!confirm(`Delete output format "${label}"?`)) return
  await deleteFormat(format.value.id)
  router.push({ name: 'formats' })
}

function onBack() {
  router.push({ name: 'formats' })
}
</script>

<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <v-btn variant="text" icon="mdi-arrow-left" title="Back" @click="onBack()" />
      <h1 class="text-h4 ml-2">Output Format</h1>
      <v-spacer />
      <v-btn
        v-if="format"
        :disabled="deleteId === format.id"
        color="error"
        variant="tonal"
        prepend-icon="mdi-delete"
        text="Delete"
        @click="onDelete()"
      />
    </v-card-title>

    <v-card-text v-if="loading" class="text-center">
      <v-progress-circular indeterminate />
    </v-card-text>

    <v-card-text v-else-if="!format" class="text-medium-emphasis">
      Format not found.
    </v-card-text>

    <v-card-text v-else>
      <section class="mb-6">
        <h2 class="text-h6 mb-2">Basics</h2>
        <v-table density="compact">
          <tbody>
            <tr>
              <th class="text-left" style="width: 200px">Filename</th>
              <td>{{ format.filename || '—' }}</td>
            </tr>
            <tr>
              <th class="text-left">Description</th>
              <td>{{ format.description || '—' }}</td>
            </tr>
            <tr>
              <th class="text-left">Output extension</th>
              <td>{{ format.output_extension }}</td>
            </tr>
            <tr>
              <th class="text-left">Created</th>
              <td>{{ new Date(format.created_at).toLocaleString() }}</td>
            </tr>
            <tr>
              <th class="text-left">Updated</th>
              <td>{{ new Date(format.updated_at).toLocaleString() }}</td>
            </tr>
          </tbody>
        </v-table>
      </section>

      <v-divider class="my-4" />

      <section class="mb-6">
        <h2 class="text-h6 mb-2">Columns</h2>
        <v-table density="compact">
          <thead>
            <tr>
              <th class="text-left">#</th>
              <th class="text-left">Name</th>
              <th class="text-left">Type</th>
              <th class="text-left">Default</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(col, idx) in format.columns" :key="idx">
              <td>{{ idx + 1 }}</td>
              <td>{{ col.name }}</td>
              <td>{{ describeColType(col.col_type) }}</td>
              <td>
                {{ col.default_value === null || col.default_value === undefined
                  ? '—'
                  : String(col.default_value) }}
              </td>
            </tr>
            <tr v-if="format.columns.length === 0">
              <td colspan="4" class="text-medium-emphasis">No columns.</td>
            </tr>
          </tbody>
        </v-table>
      </section>

      <v-divider class="my-4" />

      <section>
        <h2 class="text-h6 mb-2">Steps</h2>
        <ol v-if="format.steps.length > 0" class="pl-6">
          <li v-for="(step, idx) in format.steps" :key="idx" class="mb-3">
            <div class="text-subtitle-2 mb-1">{{ stepHeader(step) }}</div>
            <ul v-if="step.kind === 'filters'" class="pl-4">
              <li v-for="(item, iIdx) in step.items" :key="iIdx">
                <code>{{ renderExprText(item.expr as Expr) }}</code>
              </li>
            </ul>
            <ul v-else class="pl-4">
              <li v-for="(item, iIdx) in step.items" :key="iIdx">
                <code>{{ item.field }} = {{ renderExprText(item.expr as Expr) }}</code>
              </li>
            </ul>
          </li>
        </ol>
        <div v-else class="text-medium-emphasis">No steps.</div>
      </section>
    </v-card-text>
  </v-card>
</template>
