<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<template>
  <div class="app-shell auth-shell">
    <AppHeader variant="marketing" />
    <main class="app-shell-main auth-main">
      <div class="auth-bg-blob blob-1" aria-hidden="true" />
      <div class="auth-bg-blob blob-2" aria-hidden="true" />
      <div class="app-container auth-wrap">
        <div class="auth-card">
          <router-view />
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.auth-shell {
  background: var(--bg);
}

.auth-main {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 0 80px;
}

.auth-wrap {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
}

.auth-card {
  width: 100%;
  max-width: 460px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: 12px 8px;
}

.auth-bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  z-index: 0;
  pointer-events: none;
}

.blob-1 {
  width: 380px;
  height: 380px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.45), transparent 70%);
  top: -120px;
  left: -100px;
}

.blob-2 {
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent 70%);
  bottom: -160px;
  right: -120px;
}
</style>
