<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

defineProps<{ title: string }>()
</script>

<template>
  <div class="legal-page">
    <AppHeader variant="marketing" />
    <main class="app-container legal-main">
      <h1 class="legal-title">{{ title }}</h1>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.legal-page {
  color: var(--ink);
  background: var(--bg);
}

.legal-main {
  padding: 96px 24px;
  min-height: calc(100vh - var(--header-height) - 200px);
}

.legal-title {
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0;
}

.legal-main :deep(.legal-content) {
  margin-top: 36px;
  max-width: 720px;
}

.legal-main :deep(.legal-meta) {
  font-size: 13px;
  color: var(--muted);
  margin: 0 0 40px;
}

.legal-main :deep(h2) {
  font-size: clamp(16px, 2vw, 20px);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--ink);
  margin: 40px 0 10px;
  padding-top: 32px;
  border-top: 1px solid var(--line);
}

.legal-main :deep(h2:first-of-type) {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.legal-main :deep(h3) {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--ink);
  margin: 20px 0 6px;
}

.legal-main :deep(p) {
  color: var(--ink-2);
  font-size: 15px;
  line-height: 1.8;
  margin: 0 0 12px;
}

.legal-main :deep(ul),
.legal-main :deep(ol) {
  color: var(--ink-2);
  font-size: 15px;
  line-height: 1.8;
  padding-left: 22px;
  margin: 0 0 14px;
}

.legal-main :deep(li) {
  margin-bottom: 4px;
}

.legal-main :deep(a) {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.legal-main :deep(strong) {
  font-weight: 700;
  color: var(--ink);
}

.legal-main :deep(.legal-caps) {
  font-size: 13px;
  line-height: 1.7;
  color: var(--ink-2);
  letter-spacing: 0.01em;
}

@media (max-width: 768px) {
  .legal-main {
    padding: 64px 16px;
  }
}
</style>
