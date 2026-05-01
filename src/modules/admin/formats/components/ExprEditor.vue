<script setup lang="ts">
import { computed } from 'vue'
import {
  type Expr,
  type OpKind,
  OP_GROUPS,
  OP_LABELS,
  makeDefaultExpr,
} from '@/modules/admin/formats/types.ts'

const props = defineProps<{
  modelValue: Expr
  fields: string[]
  forbiddenOps?: Set<OpKind>
  depth?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [expr: Expr]
}>()

const currentDepth = computed(() => props.depth ?? 1)

const opItems = computed(() => {
  const items: Array<{ type: 'subheader'; title: string } | { title: string; value: OpKind }> =
    []
  for (const group of OP_GROUPS) {
    items.push({ type: 'subheader', title: group.label })
    for (const op of group.ops) {
      if (props.forbiddenOps?.has(op)) continue
      items.push({ title: OP_LABELS[op], value: op })
    }
  }
  return items
})

function changeOp(newOp: OpKind) {
  emit('update:modelValue', makeDefaultExpr(newOp))
}

function updateChild(key: string, expr: Expr) {
  const next = { ...props.modelValue, [key]: expr } as Expr
  emit('update:modelValue', next)
}

function updateArgAt(index: number, expr: Expr) {
  const node = props.modelValue
  if (!('args' in node)) return
  const args = [...node.args]
  args[index] = expr
  emit('update:modelValue', { ...node, args } as Expr)
}

function updateItemAt(index: number, expr: Expr) {
  if (props.modelValue.op !== 'in') return
  const items = [...props.modelValue.items]
  items[index] = expr
  emit('update:modelValue', { ...props.modelValue, items })
}

function addArg() {
  const node = props.modelValue
  if (!('args' in node)) return
  const args = [...node.args, makeDefaultExpr('str')]
  emit('update:modelValue', { ...node, args } as Expr)
}

function removeArg(index: number) {
  const node = props.modelValue
  if (!('args' in node)) return
  const args = [...node.args]
  args.splice(index, 1)
  emit('update:modelValue', { ...node, args } as Expr)
}

function addItem() {
  if (props.modelValue.op !== 'in') return
  const items = [...props.modelValue.items, makeDefaultExpr('str')]
  emit('update:modelValue', { ...props.modelValue, items })
}

function removeItem(index: number) {
  if (props.modelValue.op !== 'in') return
  const items = [...props.modelValue.items]
  items.splice(index, 1)
  emit('update:modelValue', { ...props.modelValue, items })
}

function updateNum(value: string) {
  const num = Number(value)
  if (Number.isFinite(num)) {
    emit('update:modelValue', { op: 'num', value: num })
  }
}

function updateStr(value: string) {
  emit('update:modelValue', { op: 'str', value })
}

function updateBool(value: boolean) {
  emit('update:modelValue', { op: 'bool', value })
}

function updateField(value: string) {
  emit('update:modelValue', { op: 'var', field: value })
}

function variadicMin(): number {
  switch (props.modelValue.op) {
    case 'and':
    case 'or':
    case 'concat':
      return 2
    default:
      return 0
  }
}
</script>

<template>
  <div class="expr-node" :class="{ nested: currentDepth > 1 }">
    <div class="d-flex align-start ga-2">
      <v-select
        :model-value="modelValue.op"
        :items="opItems"
        item-title="title"
        item-value="value"
        density="compact"
        variant="outlined"
        hide-details
        label="Op"
        class="op-select flex-shrink-0"
        @update:model-value="changeOp($event as OpKind)"
      />

      <div class="flex-grow-1">
        <v-text-field
          v-if="modelValue.op === 'num'"
          :model-value="modelValue.value"
          type="number"
          density="compact"
          variant="outlined"
          hide-details
          label="Number"
          @update:model-value="updateNum($event)"
        />

        <v-text-field
          v-else-if="modelValue.op === 'str'"
          :model-value="modelValue.value"
          density="compact"
          variant="outlined"
          hide-details
          label="String"
          @update:model-value="updateStr($event)"
        />

        <v-switch
          v-else-if="modelValue.op === 'bool'"
          :model-value="modelValue.value"
          density="compact"
          color="primary"
          hide-details
          inset
          :label="modelValue.value ? 'true' : 'false'"
          @update:model-value="updateBool($event ?? false)"
        />

        <div v-else-if="modelValue.op === 'null'" class="text-medium-emphasis pt-1">
          null
        </div>

        <v-combobox
          v-else-if="modelValue.op === 'var'"
          :model-value="modelValue.field"
          :items="fields"
          density="compact"
          variant="outlined"
          hide-details
          label="Field"
          @update:model-value="updateField($event ?? '')"
        />
      </div>
    </div>

    <div
      v-if="
        modelValue.op === '+' ||
        modelValue.op === '-' ||
        modelValue.op === '*' ||
        modelValue.op === '/' ||
        modelValue.op === '>' ||
        modelValue.op === '>=' ||
        modelValue.op === '<' ||
        modelValue.op === '<=' ||
        modelValue.op === '==' ||
        modelValue.op === '!='
      "
      class="children mt-2"
    >
      <div class="child">
        <div class="child-label">Left</div>
        <ExprEditor
          :model-value="modelValue.args[0]"
          :fields="fields"
          :forbidden-ops="forbiddenOps"
          :depth="currentDepth + 1"
          @update:model-value="updateArgAt(0, $event)"
        />
      </div>
      <div class="child">
        <div class="child-label">Right</div>
        <ExprEditor
          :model-value="modelValue.args[1]"
          :fields="fields"
          :forbidden-ops="forbiddenOps"
          :depth="currentDepth + 1"
          @update:model-value="updateArgAt(1, $event)"
        />
      </div>
    </div>

    <div
      v-else-if="
        modelValue.op === 'and' || modelValue.op === 'or' || modelValue.op === 'concat'
      "
      class="children mt-2"
    >
      <div v-for="(arg, idx) in modelValue.args" :key="idx" class="child">
        <div class="d-flex align-center">
          <div class="child-label flex-grow-1">{{ idx + 1 }}</div>
          <v-btn
            v-if="modelValue.args.length > variadicMin()"
            size="x-small"
            variant="text"
            icon="mdi-close"
            color="error"
            @click="removeArg(idx)"
          />
        </div>
        <ExprEditor
          :model-value="arg"
          :fields="fields"
          :forbidden-ops="forbiddenOps"
          :depth="currentDepth + 1"
          @update:model-value="updateArgAt(idx, $event)"
        />
      </div>
      <v-btn
        size="small"
        variant="tonal"
        prepend-icon="mdi-plus"
        text="Add"
        @click="addArg()"
      />
    </div>

    <div v-else-if="modelValue.op === '!'" class="children mt-2">
      <div class="child">
        <ExprEditor
          :model-value="modelValue.arg"
          :fields="fields"
          :forbidden-ops="forbiddenOps"
          :depth="currentDepth + 1"
          @update:model-value="updateChild('arg', $event)"
        />
      </div>
    </div>

    <div v-else-if="modelValue.op === 'if'" class="children mt-2">
      <div class="child">
        <div class="child-label">If</div>
        <ExprEditor
          :model-value="modelValue.cond"
          :fields="fields"
          :forbidden-ops="forbiddenOps"
          :depth="currentDepth + 1"
          @update:model-value="updateChild('cond', $event)"
        />
      </div>
      <div class="child">
        <div class="child-label">Then</div>
        <ExprEditor
          :model-value="modelValue.then"
          :fields="fields"
          :forbidden-ops="forbiddenOps"
          :depth="currentDepth + 1"
          @update:model-value="updateChild('then', $event)"
        />
      </div>
      <div class="child">
        <div class="child-label">Else</div>
        <ExprEditor
          :model-value="modelValue.else"
          :fields="fields"
          :forbidden-ops="forbiddenOps"
          :depth="currentDepth + 1"
          @update:model-value="updateChild('else', $event)"
        />
      </div>
    </div>

    <div v-else-if="modelValue.op === 'in'" class="children mt-2">
      <div class="child">
        <div class="child-label">Value</div>
        <ExprEditor
          :model-value="modelValue.value"
          :fields="fields"
          :forbidden-ops="forbiddenOps"
          :depth="currentDepth + 1"
          @update:model-value="updateChild('value', $event)"
        />
      </div>
      <div class="child">
        <div class="child-label">In items</div>
        <div v-for="(item, idx) in modelValue.items" :key="idx" class="child sub-item">
          <div class="d-flex align-center">
            <div class="child-label flex-grow-1">Item {{ idx + 1 }}</div>
            <v-btn
              v-if="modelValue.items.length > 1"
              size="x-small"
              variant="text"
              icon="mdi-close"
              color="error"
              @click="removeItem(idx)"
            />
          </div>
          <ExprEditor
            :model-value="item"
            :fields="fields"
            :forbidden-ops="forbiddenOps"
            :depth="currentDepth + 1"
            @update:model-value="updateItemAt(idx, $event)"
          />
        </div>
        <v-btn
          size="small"
          variant="tonal"
          prepend-icon="mdi-plus"
          text="Add item"
          @click="addItem()"
        />
      </div>
    </div>

    <div v-else-if="modelValue.op === 'round'" class="children mt-2">
      <div class="child">
        <div class="child-label">Value</div>
        <ExprEditor
          :model-value="modelValue.value"
          :fields="fields"
          :forbidden-ops="forbiddenOps"
          :depth="currentDepth + 1"
          @update:model-value="updateChild('value', $event)"
        />
      </div>
      <div class="child">
        <div class="child-label">Decimals</div>
        <ExprEditor
          :model-value="modelValue.decimals"
          :fields="fields"
          :forbidden-ops="forbiddenOps"
          :depth="currentDepth + 1"
          @update:model-value="updateChild('decimals', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.expr-node {
  border-radius: 4px;
}
.expr-node.nested {
  border-left: 2px solid rgba(var(--v-theme-primary), 0.3);
  padding-left: 12px;
}
.op-select {
  min-width: 180px;
  max-width: 220px;
}
.children {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.child {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.child-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(var(--v-theme-on-surface), 0.6);
}
.sub-item {
  margin-left: 12px;
}
</style>
