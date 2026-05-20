<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { notify } from '@kyvg/vue3-notification'
import { useUserStore } from '@/stores/userStore.ts'
import { useUser } from '@/tanstack/useUser.ts'
import { useUserRoles } from '@/helpers/roles/useUserRoles.ts'
import { handleApiError } from '@/api/helpers/handleApiError.ts'
import { TypeRoleV1 } from '@/api/__generated__/v1/data-contracts.ts'

const props = withDefaults(
  defineProps<{
    variant?: 'marketing' | 'app'
  }>(),
  { variant: 'marketing' },
)

const router = useRouter()
const userStore = useUserStore()
const { isAuthenticated } = storeToRefs(userStore)
const { data: user } = useUser()
const { hasRole } = useUserRoles()

const drawer = ref(false)

const marketingLinks = [
  { label: 'Features', to: '/#features' },
  { label: 'Pricing', to: '/#pricing' },
  { label: 'FAQ', to: '/#faq' },
]

const appLinks = computed(() => {
  const links = [
    { label: 'My QRs', to: '/qrs' },
    { label: 'Profile', to: '/profile' },
  ]
  if (hasRole([TypeRoleV1.EnumAdmin])) {
    links.push({ label: 'Users', to: '/admin/users' })
  }
  return links
})

const navLinks = computed(() => (props.variant === 'marketing' ? marketingLinks : appLinks.value))

async function logout() {
  drawer.value = false
  try {
    await userStore.logout()
    await router.push('/login')
    notify({ type: 'success', title: 'Logout', text: 'You have been logged out!' })
  } catch (e) {
    handleApiError(e, { title: 'Logout' })
  }
}

const userInitial = computed(() => {
  const source = user.value?.display_name || user.value?.email || ''
  return source ? source.charAt(0).toUpperCase() : '?'
})
</script>

<template>
  <header class="site-header">
    <div class="app-container header-inner">
      <router-link to="/" class="logo" aria-label="QR Manager home">
        <span class="logo-mark">
          <v-icon icon="mdi-qrcode" size="22" />
        </span>
        <span class="logo-text">QR Manager</span>
      </router-link>

      <nav class="nav-links" aria-label="Primary">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          @click="drawer = false"
        >
          {{ link.label }}
        </router-link>
      </nav>

      <div class="header-cta">
        <template v-if="variant === 'marketing'">
          <template v-if="isAuthenticated">
            <router-link to="/qrs" class="app-btn app-btn-primary">Go to My QRs</router-link>
          </template>
          <template v-else>
            <router-link to="/login" class="app-btn app-btn-ghost">Login</router-link>
            <router-link to="/register" class="app-btn app-btn-primary">Register</router-link>
          </template>
        </template>

        <template v-else>
          <v-menu offset-y location="bottom end">
            <template #activator="{ props: menuProps }">
              <button v-bind="menuProps" class="user-chip" aria-label="Account">
                <span class="user-avatar">{{ userInitial }}</span>
                <span class="user-email">{{ user?.email || user?.display_name || 'Account' }}</span>
                <v-icon icon="mdi-chevron-down" size="16" />
              </button>
            </template>
            <v-list density="comfortable" class="account-menu">
              <v-list-item to="/profile" prepend-icon="mdi-account-circle" title="Profile" />
              <v-divider />
              <v-list-item
                prepend-icon="mdi-logout"
                title="Logout"
                base-color="error"
                @click="logout"
              />
            </v-list>
          </v-menu>
        </template>
      </div>

      <button
        class="hamburger"
        aria-label="Open navigation"
        data-testid="mobile-nav-toggle"
        @click="drawer = !drawer"
      >
        <v-icon :icon="drawer ? 'mdi-close' : 'mdi-menu'" />
      </button>
    </div>

    <div v-if="drawer" class="mobile-drawer">
      <router-link
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        @click="drawer = false"
      >
        {{ link.label }}
      </router-link>
      <div class="drawer-cta">
        <template v-if="variant === 'marketing'">
          <template v-if="isAuthenticated">
            <router-link to="/qrs" class="app-btn app-btn-primary app-btn-block" @click="drawer = false">
              Go to My QRs
            </router-link>
          </template>
          <template v-else>
            <router-link to="/login" class="app-btn app-btn-ghost app-btn-block" @click="drawer = false">
              Login
            </router-link>
            <router-link to="/register" class="app-btn app-btn-primary app-btn-block" @click="drawer = false">
              Register
            </router-link>
          </template>
        </template>
        <template v-else>
          <button class="app-btn app-btn-ghost app-btn-block" @click="logout">Logout</button>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: saturate(180%) blur(12px);
  background: rgba(255, 255, 255, 0.82);
  border-bottom: 1px solid var(--line);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  gap: 24px;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: var(--ink);
  text-decoration: none;
  font-size: 17px;
  line-height: 1;
}

.logo-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: var(--gradient);
  color: #fff;
}

.nav-links {
  display: flex;
  gap: 28px;
}

.nav-links a {
  color: var(--ink-2);
  text-decoration: none;
  font-weight: 500;
  font-size: 14.5px;
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: var(--accent);
}

.header-cta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 6px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: #fff;
  cursor: pointer;
  color: var(--ink);
  font-weight: 500;
  font-size: 14px;
  transition: border-color 0.2s ease;
  max-width: 260px;
}

.user-chip:hover {
  border-color: var(--line-strong);
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--gradient);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
}

.user-email {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.hamburger {
  display: none;
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 10px;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  color: var(--ink);
  cursor: pointer;
}

.mobile-drawer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 24px 22px;
  border-top: 1px solid var(--line);
  background: #fff;
}

.mobile-drawer > a {
  color: var(--ink-2);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
}

.drawer-cta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

@media (max-width: 960px) {
  .nav-links,
  .header-cta {
    display: none;
  }

  .hamburger {
    display: inline-flex;
  }
}
</style>
