<script setup lang="ts">
import { Notifications as NotificationComponent } from '@kyvg/vue3-notification'

type NotificationType = 'success' | 'warn' | 'error' | 'info' | string

function iconFor(type?: NotificationType) {
  switch (type) {
    case 'success':
      return 'mdi-check-circle'
    case 'warn':
      return 'mdi-alert'
    case 'error':
      return 'mdi-alert-circle'
    default:
      return 'mdi-information'
  }
}

function variantClass(type?: NotificationType) {
  switch (type) {
    case 'success':
      return 'app-notif-success'
    case 'warn':
      return 'app-notif-warn'
    case 'error':
      return 'app-notif-error'
    default:
      return 'app-notif-info'
  }
}
</script>

<template>
  <NotificationComponent
    position="top right"
    :duration="4000"
    :pauseOnHover="true"
    width="380"
    class="app-notifications"
  >
    <template #body="{ item, close }">
      <div class="app-notif" :class="variantClass(item.type)" role="status">
        <span class="app-notif-icon">
          <v-icon :icon="iconFor(item.type)" size="20" />
        </span>
        <div class="app-notif-body">
          <div v-if="item.title" class="app-notif-title">{{ item.title }}</div>
          <div v-if="item.text" class="app-notif-text">{{ item.text }}</div>
        </div>
        <button
          type="button"
          class="app-notif-close"
          aria-label="Close notification"
          @click="close"
        >
          <v-icon icon="mdi-close" size="16" />
        </button>
      </div>
    </template>
  </NotificationComponent>
</template>

<style scoped>
.app-notifications {
  top: calc(var(--header-height) + 12px) !important;
  right: 16px !important;
  z-index: 9999;
}

.app-notif {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #fff;
  border: 1px solid var(--line);
  border-left: 4px solid var(--accent);
  border-radius: var(--radius);
  padding: 12px 14px;
  margin: 0 0 10px;
  box-shadow: var(--shadow-card);
  color: var(--ink);
  font-size: 14px;
  line-height: 1.4;
  min-height: 56px;
  animation: app-notif-in 0.22s ease-out;
}

.app-notif-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  flex-shrink: 0;
}

.app-notif-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.app-notif-title {
  font-weight: 600;
  color: var(--ink);
  font-size: 14px;
  word-break: break-word;
}

.app-notif-text {
  color: var(--ink-2);
  font-size: 13px;
  word-break: break-word;
}

.app-notif-close {
  background: transparent;
  border: none;
  padding: 4px;
  border-radius: 8px;
  cursor: pointer;
  color: var(--muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, color 0.15s ease;
  flex-shrink: 0;
}

.app-notif-close:hover {
  background: var(--bg-soft);
  color: var(--ink);
}

.app-notif-success {
  border-left-color: var(--success);
}

.app-notif-success .app-notif-icon {
  background: rgba(34, 197, 94, 0.12);
  color: var(--success);
}

.app-notif-warn {
  border-left-color: var(--warning);
}

.app-notif-warn .app-notif-icon {
  background: rgba(245, 158, 11, 0.14);
  color: var(--warning);
}

.app-notif-error {
  border-left-color: var(--danger);
}

.app-notif-error .app-notif-icon {
  background: rgba(239, 68, 68, 0.12);
  color: var(--danger);
}

.app-notif-info {
  border-left-color: var(--accent);
}

.app-notif-info .app-notif-icon {
  background: var(--accent-soft);
  color: var(--accent);
}

@keyframes app-notif-in {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 560px) {
  .app-notifications {
    right: 8px !important;
    left: 8px !important;
    width: auto !important;
  }
}
</style>
