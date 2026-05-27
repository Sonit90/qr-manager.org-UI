<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const route = useRoute()
const qrId = computed(() => (route.query.qr_id as string | undefined) ?? '')
</script>

<template>
  <div class="app-shell">
    <AppHeader variant="marketing" />
    <main class="app-shell-main centered">
      <div class="app-container">
        <div class="disabled-card panel">
          <div class="disabled-icon">
            <v-icon icon="mdi-link-off" size="36" />
          </div>
          <h1 class="disabled-title">QR Code Disabled</h1>
          <p class="disabled-sub">This QR code has been disabled by the owner.</p>
          <p v-if="qrId" class="disabled-id">QR ID: {{ qrId }}</p>
          <router-link to="/" class="app-btn app-btn-primary app-btn-lg back-home">
            <v-icon icon="mdi-arrow-left" size="16" />
            Back to home
          </router-link>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.centered {
  display: flex;
  align-items: center;
  justify-content: center;
}

.disabled-card {
  max-width: 460px;
  margin: 0 auto;
  padding: 40px 32px;
  text-align: center;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.disabled-icon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: rgba(245, 158, 11, 0.12);
  color: var(--warning);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.disabled-title {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 700;
  color: var(--ink);
}

.disabled-sub {
  color: var(--muted);
  margin: 0 0 18px;
  font-size: 15px;
}

.disabled-id {
  display: inline-block;
  background: var(--bg-soft);
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 6px 10px;
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 12.5px;
  color: var(--ink-2);
  margin: 0 0 24px;
}

.back-home {
  display: inline-flex;
}
</style>
