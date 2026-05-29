<script setup lang="ts">
import { notify } from '@kyvg/vue3-notification'
import EditableUserField from '@/modules/user/EditableUserField.vue'
import { formatDate } from '@/helpers/formatDate.ts'
import { useUser } from '@/tanstack/useUser.ts'

const { isLoading, data: user } = useUser()

function getRoleBadgeClass(role?: string) {
  switch ((role ?? '').toLowerCase()) {
    case 'admin':
      return 'app-badge-danger'
    case 'moderator':
      return 'app-badge-warning'
    default:
      return 'app-badge-accent'
  }
}

const planFeatures = [
  'Unlimited dynamic QR codes',
  'Editable destinations',
  'Disable & reactivate anytime',
  'Scan analytics',
  '99.99% redirect uptime',
]

function notImplemented(title: string) {
  notify({ type: 'info', title, text: 'Coming soon.' })
}
</script>

<template>
  <div class="app-page profile-page">
    <header class="app-page-head">
      <div>
        <span class="app-eyebrow">Account</span>
        <h1 class="app-page-title">Profile &amp; settings</h1>
        <p class="app-page-sub">Manage your account, security, and plan details.</p>
      </div>
    </header>

    <div v-if="isLoading" class="loading-state">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <div v-else class="settings-grid">
      <section class="panel" data-testid="user-info-container">
        <div class="panel-head">
          <div class="profile-head">
            <div class="profile-avatar">
              <v-icon icon="mdi-account" size="26" />
            </div>
            <h2 class="panel-head-title">Profile</h2>
          </div>
        </div>
        <div class="panel-body panel-body-flush">
          <v-list density="comfortable" class="profile-list">
            <EditableUserField
              icon="mdi-email"
              label="Email"
              :original-value="user?.email ?? '—'"
            />
            <EditableUserField
              icon="mdi-account"
              label="Name"
              :original-value="user?.display_name ?? '—'"
            />
            <EditableUserField icon="mdi-shield-account" label="Role">
              <span v-if="user?.role" class="app-badge" :class="getRoleBadgeClass(user?.role)">
                {{ user.role }}
              </span>
            </EditableUserField>
            <EditableUserField icon="mdi-email-check" label="Email verified">
              <span
                class="app-badge"
                :class="user?.email_verified ? 'app-badge-success' : 'app-badge-warning'"
              >
                {{ user?.email_verified ? 'Verified' : 'Unverified' }}
              </span>
            </EditableUserField>
            <EditableUserField icon="mdi-account-check" label="Status">
              <span
                class="app-badge"
                :class="user?.is_active ? 'app-badge-success' : 'app-badge-danger'"
              >
                {{ user?.is_active ? 'Active' : 'Inactive' }}
              </span>
            </EditableUserField>
            <EditableUserField
              icon="mdi-calendar-plus"
              label="Member since"
              :original-value="formatDate(user?.created_at)"
            />
            <EditableUserField
              icon="mdi-calendar-edit"
              label="Last updated"
              :original-value="formatDate(user?.updated_at)"
            />
          </v-list>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-head-title">Security</h2>
            <p class="panel-head-sub">Password and account safety controls.</p>
          </div>
        </div>
        <div class="panel-body security-body">
          <div class="security-row">
            <div>
              <div class="row-title">Password</div>
              <div class="row-sub">Change your account password.</div>
            </div>
            <button
              type="button"
              class="app-btn app-btn-ghost"
              @click="notImplemented('Change password')"
            >
              Change password
            </button>
          </div>
          <!--          <div class="security-row">-->
          <!--            <div>-->
          <!--              <div class="row-title">Two-factor authentication</div>-->
          <!--              <div class="row-sub">Add an extra layer of protection at sign-in.</div>-->
          <!--            </div>-->
          <!--            <button-->
          <!--              type="button"-->
          <!--              class="app-btn app-btn-ghost"-->
          <!--              @click="notImplemented('Enable 2FA')"-->
          <!--            >-->
          <!--              Enable 2FA-->
          <!--            </button>-->
          <!--          </div>-->
          <!--          <div class="security-row">-->
          <!--            <div>-->
          <!--              <div class="row-title">Active sessions</div>-->
          <!--              <div class="row-sub">Review and revoke devices currently signed in.</div>-->
          <!--            </div>-->
          <!--            <button-->
          <!--              type="button"-->
          <!--              class="app-btn app-btn-ghost"-->
          <!--              @click="notImplemented('View sessions')"-->
          <!--            >-->
          <!--              View sessions-->
          <!--            </button>-->
          <!--          </div>-->
        </div>
      </section>

      <section class="panel plan-panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-head-title">Your plan</h2>
            <p class="panel-head-sub">Everything included, forever.</p>
          </div>
          <span class="app-badge app-badge-accent">Free</span>
        </div>
        <div class="panel-body">
          <div class="plan-price">
            <span class="plan-price-amount">$0</span>
            <span class="plan-price-period">/ forever</span>
          </div>
          <ul class="plan-features">
            <li v-for="feature in planFeatures" :key="feature">
              <v-icon icon="mdi-check-circle" size="18" />
              {{ feature }}
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.loading-state {
  display: flex;
  justify-content: center;
  padding: 64px 0;
}

.settings-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.settings-grid > .panel:nth-child(1) {
  grid-row: span 2;
}

.profile-head {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.profile-avatar {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--gradient);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.profile-list {
  padding: 0;
  background: transparent;
}

.profile-list :deep(.v-list-item) {
  padding-inline: 22px;
  min-height: 56px;
  border-bottom: 1px solid var(--line);
}

.profile-list :deep(.v-list-item:last-child) {
  border-bottom: none;
}

.security-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.security-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
}

.security-row:last-child {
  border-bottom: none;
}

.row-title {
  font-weight: 600;
  color: var(--ink);
  font-size: 14.5px;
}

.row-sub {
  color: var(--muted);
  font-size: 13.5px;
  margin-top: 2px;
}

.plan-price {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 16px;
}

.plan-price-amount {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.plan-price-period {
  color: var(--muted);
  font-size: 14px;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0;
}

.plan-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  font-size: 14px;
  color: var(--ink-2);
}

.plan-features :deep(.v-icon) {
  color: var(--accent);
}

@media (max-width: 960px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }

  .settings-grid > .panel:nth-child(1) {
    grid-row: auto;
  }
}
</style>
