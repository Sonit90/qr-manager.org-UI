<script setup lang="ts">
import { computed, useSlots } from 'vue'

defineProps<{
  title: string
  subtitle?: string
}>()

const slots = useSlots()
const hasAppendSlot = computed(() => !!slots.append)
</script>

<template>
  <div class="auth-form">
    <header class="auth-head">
      <h1 class="auth-title">{{ title }}</h1>
      <p v-if="subtitle" class="auth-sub">{{ subtitle }}</p>
    </header>
    <div class="auth-body">
      <slot />
      <template v-if="hasAppendSlot">
        <div class="auth-divider">
          <span>or</span>
        </div>
        <div class="auth-append">
          <slot name="append" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.auth-form {
  padding: 12px 16px 18px;
}

.auth-head {
  text-align: center;
  padding: 18px 6px 22px;
}

.auth-title {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.015em;
  color: var(--ink);
}

.auth-sub {
  margin: 0;
  color: var(--muted);
  font-size: 14.5px;
}

.auth-body {
  padding: 6px;
}

.auth-divider {
  margin: 18px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--muted);
  font-size: 12.5px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--line);
}

.auth-append {
  text-align: center;
  color: var(--ink-2);
  font-size: 14px;
}

.auth-append :deep(a),
.auth-append :deep(.link-styled) {
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
}

.auth-append :deep(a):hover {
  text-decoration: underline;
}
</style>
