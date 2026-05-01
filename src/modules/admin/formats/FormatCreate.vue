<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  TypeFileKindV1,
  type TypeCreateFormatReqV1,
  type TypeOutputColumnV1,
  type TypeOutputStepV1,
} from '@/api/__generated__/v1/data-contracts.ts'
import { useAdminFormats } from '@/modules/admin/formats/composables/useAdminFormats.ts'
import ColumnsEditor from '@/modules/admin/formats/components/ColumnsEditor.vue'
import StepsEditor from '@/modules/admin/formats/components/StepsEditor.vue'
import {
  type Expr,
  countNodes,
  exprIsValid,
  exprUsesForbiddenOps,
  forbiddenOpsForColType,
  MAX_DEPTH,
  MAX_NODES,
  maxDepth,
} from '@/modules/admin/formats/types.ts'

const router = useRouter()
const { submitting, createFormat } = useAdminFormats()

const form = reactive<{
  filename: string
  description: string
  output_extension: TypeFileKindV1
  columns: TypeOutputColumnV1[]
  steps: TypeOutputStepV1[]
}>({
  filename: '',
  description: '',
  output_extension: TypeFileKindV1.EnumXlsx,
  columns: [],
  steps: [],
})

const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

const extensionItems = [
  { title: 'XLSX (Excel)', value: TypeFileKindV1.EnumXlsx },
  { title: 'XLS (Excel legacy)', value: TypeFileKindV1.EnumXls },
  { title: 'CSV', value: TypeFileKindV1.EnumCsv },
]

const stepValidationErrors = computed<string[]>(() => {
  const errors: string[] = []
  form.steps.forEach((step, idx) => {
    const expr = step.expr as Expr
    if (!exprIsValid(expr)) {
      if (countNodes(expr) > MAX_NODES) {
        errors.push(`Step ${idx + 1}: expression exceeds ${MAX_NODES} nodes.`)
      } else if (maxDepth(expr) > MAX_DEPTH) {
        errors.push(`Step ${idx + 1}: expression depth exceeds ${MAX_DEPTH}.`)
      } else {
        errors.push(`Step ${idx + 1}: expression has incomplete or invalid nodes.`)
      }
    }
    if (step.kind === 'transform') {
      if (!step.field) {
        errors.push(`Step ${idx + 1}: transform requires a target field.`)
      } else {
        const col = form.columns.find((c) => (c.canonical || c.name) === step.field)
        const forbidden = forbiddenOpsForColType(col?.col_type)
        if (exprUsesForbiddenOps(expr, forbidden)) {
          errors.push(
            `Step ${idx + 1}: expression uses operations forbidden for ${col?.col_type?.kind ?? 'string'} columns.`,
          )
        }
      }
    }
  })
  return errors
})

const columnValidationErrors = computed<string[]>(() => {
  const errors: string[] = []
  if (form.columns.length === 0) errors.push('At least one column is required.')
  const names = new Set<string>()
  form.columns.forEach((col, idx) => {
    if (!col.name.trim()) {
      errors.push(`Column ${idx + 1}: name is required.`)
    } else if (names.has(col.name)) {
      errors.push(`Column ${idx + 1}: duplicate name "${col.name}".`)
    } else {
      names.add(col.name)
    }
    if (col.col_type?.kind === 'datetime' && col.col_type.format.type === 'custom') {
      if (!col.col_type.format.pattern.trim()) {
        errors.push(`Column ${idx + 1}: custom datetime pattern is required.`)
      }
    }
  })
  return errors
})

const allErrors = computed(() => [
  ...columnValidationErrors.value,
  ...stepValidationErrors.value,
])

const canSubmit = computed(() => allErrors.value.length === 0 && !submitting.value)

async function onSubmit() {
  if (!canSubmit.value) return
  const body: TypeCreateFormatReqV1 = {
    filename: form.filename.trim() || null,
    description: form.description.trim() || null,
    output_extension: form.output_extension,
    columns: form.columns,
    steps: form.steps,
  }
  try {
    const created = await createFormat(body)
    if (created) {
      router.push({ name: 'format-detail', params: { id: created.id } })
    }
  } catch {
    // handleApiError already notified
  }
}

function onCancel() {
  router.push({ name: 'formats' })
}
</script>

<template>
  <v-card>
    <v-card-title class="d-flex">
      <h1 class="text-h4">New Output Format</h1>
      <v-spacer />
      <v-btn variant="text" prepend-icon="mdi-arrow-left" text="Back" @click="onCancel()" />
    </v-card-title>

    <v-card-text>
      <v-form ref="formRef">
        <section class="mb-6">
          <h2 class="text-h6 mb-3">Basics</h2>
          <div class="d-flex ga-3 flex-wrap">
            <v-text-field
              v-model.trim="form.filename"
              label="Filename (optional, no extension)"
              variant="outlined"
              density="compact"
              hint="UUID will be used if empty"
              persistent-hint
              style="min-width: 240px"
              class="flex-grow-1"
            />
            <v-select
              v-model="form.output_extension"
              :items="extensionItems"
              label="Output extension"
              variant="outlined"
              density="compact"
              style="min-width: 200px"
              class="flex-grow-0"
            />
          </div>
          <v-textarea
            v-model.trim="form.description"
            label="Description (optional)"
            variant="outlined"
            density="compact"
            rows="2"
            class="mt-3"
          />
        </section>

        <v-divider class="my-4" />

        <section class="mb-6">
          <h2 class="text-h6 mb-3">Columns</h2>
          <ColumnsEditor v-model="form.columns" />
        </section>

        <v-divider class="my-4" />

        <section class="mb-6">
          <h2 class="text-h6 mb-3">Steps</h2>
          <StepsEditor v-model="form.steps" :columns="form.columns" />
        </section>

        <v-alert
          v-if="allErrors.length > 0"
          type="warning"
          variant="tonal"
          density="compact"
          class="mb-3"
        >
          <ul class="pl-4">
            <li v-for="(err, i) in allErrors" :key="i">{{ err }}</li>
          </ul>
        </v-alert>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn variant="text" text="Cancel" @click="onCancel()" />
      <v-btn
        :disabled="!canSubmit"
        :loading="submitting"
        color="primary"
        variant="tonal"
        prepend-icon="mdi-content-save"
        text="Create format"
        @click="onSubmit()"
      />
    </v-card-actions>
  </v-card>
</template>
