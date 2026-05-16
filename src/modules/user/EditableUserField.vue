<script setup lang="ts">
defineProps<{
  isEditing?: boolean
  icon?: string
  label: string
  originalValue?: string | null | undefined
}>()

const model = defineModel<string | null | undefined>()
</script>

<template>
  <v-list-item class="editable-row">
    <template v-if="icon" #prepend>
      <span class="row-icon">
        <v-icon :icon="icon" size="18" />
      </span>
    </template>
    <div class="row-content">
      <span class="row-label">{{ label }}</span>
      <v-text-field
        v-if="isEditing"
        v-model.trim="model"
        density="compact"
        variant="outlined"
        hide-details
      />
    </div>
    <template #append>
      <slot>
        <span v-if="!isEditing" class="row-value">{{ originalValue }}</span>
      </slot>
    </template>
  </v-list-item>
</template>

<style scoped>
.editable-row {
  padding-block: 6px;
}

.row-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: var(--accent-soft);
  color: var(--accent);
  margin-right: 8px;
}

.row-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.row-label {
  font-size: 13.5px;
  color: var(--muted);
  font-weight: 500;
}

.row-value {
  font-size: 14px;
  color: var(--ink);
  font-weight: 500;
  text-align: right;
  word-break: break-word;
}
</style>
