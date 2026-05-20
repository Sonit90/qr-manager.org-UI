<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useUserStore } from '@/stores/userStore.ts'
import { storeToRefs } from 'pinia'

const consentAccepted = useStorage('consent_accepted', false)
const userStore = useUserStore()
const { isAuthenticated } = storeToRefs(userStore)
const appName = import.meta.env.VITE_APP_NAME

const visible = computed(() => !isAuthenticated.value && !consentAccepted.value)

function accept() {
  consentAccepted.value = true
}
</script>

<template>
  <Transition name="consent-banner">
    <div v-if="visible" class="consent-banner" role="dialog" aria-label="Cookie and consent notice">
      <div class="consent-banner-inner">
        <p class="consent-banner-text">
          We use cookies and similar technologies to operate the service and improve your
          experience. By continuing to use {{ appName }}, you agree to our
          <router-link to="/terms" class="consent-banner-link">Terms of Service</router-link>
          and
          <router-link to="/privacy" class="consent-banner-link">Privacy Policy</router-link>.
        </p>
        <button class="app-btn app-btn-primary app-btn-sm consent-banner-btn" @click="accept">
          Accept
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.consent-banner {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 48px);
  max-width: 620px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  z-index: 9999;
  padding: 16px 20px;
}

.consent-banner-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.consent-banner-text {
  flex: 1;
  min-width: 200px;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--ink-2);
  margin: 0;
}

.consent-banner-link {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 2px;
  white-space: nowrap;
}

.consent-banner-btn {
  flex-shrink: 0;
}

.consent-banner-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.consent-banner-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.consent-banner-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(16px);
}

.consent-banner-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(16px);
}

@media (max-width: 480px) {
  .consent-banner {
    bottom: 16px;
    width: calc(100% - 32px);
    padding: 14px 16px;
  }

  .consent-banner-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .consent-banner-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
