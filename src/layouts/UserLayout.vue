<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/userStore.ts'
import { useRouter } from 'vue-router'
import { notify } from '@kyvg/vue3-notification'
import { handleApiError } from '@/api/helpers/handleApiError.ts'
import { useUser } from '@/tanstack/useUser.ts'
import { UserRole } from '@/types/user/roles.ts'
import { useUserRoles } from '@/helpers/roles/useUserRoles.ts'
import VersionInfo from '@/components/version/VersionInfo.vue'
import LogoIcon from '@/assets/logo.svg'

const drawer = ref(true)
const rail = ref(false)

const userStore = useUserStore()

const navigationItems = [
  { title: 'My Files', icon: 'mdi-file-multiple', to: '/my-files' },
  { title: 'Transformations', icon: 'mdi-file-excel', to: '/merges' },
  { title: 'Users', icon: 'mdi-account-group', to: '/admin/users', roles: [UserRole.ADMIN] },
]

const { hasRole } = useUserRoles()
const availableNavigationItems = computed(() =>
  navigationItems.filter((item) => {
    if (!item.roles) return true
    return hasRole(item.roles)
  }),
)

const { data: user } = useUser()

const router = useRouter()
async function logout() {
  try {
    await userStore.logout()
    await router.push('/login')
    notify({
      type: 'success',
      title: 'Logout',
      text: 'You have been logged out!',
    })
  } catch (e) {
    handleApiError(e, { title: 'Logout' })
  }
}
</script>

<template>
  <v-app-bar color="primary" dark elevation="1" app>
    <v-app-bar-nav-icon @click="drawer = !drawer" />

    <!-- Logo -->
    <div class="d-flex align-center flex-grow-1">
      <LogoIcon class="logo-icon mx-2" alt="Logo" height="32" width="32" />
      <v-toolbar-title class="text-h6 font-weight-bold flex-grow-1"> MyApp </v-toolbar-title>
    </div>

    <v-spacer />

    <v-menu
      offset-y
      :offset="2"
      location="bottom right"
      width="300"
      :transition="false"
      :close-on-content-click="false"
    >
      <template #activator="{ props }">
        <v-btn v-bind="props" prepend-icon="mdi-information-outline" text="Version Info" />
      </template>
      <VersionInfo />
    </v-menu>

    <!-- User Menu -->
    <v-menu offset-y>
      <template #activator="{ props }">
        <v-btn v-bind="props" class="me-2">
          {{ user?.email || user?.full_name }}
          <v-avatar size="32">
            <v-icon>mdi-account</v-icon>
          </v-avatar>
        </v-btn>
      </template>

      <v-list>
        <v-list-item to="/user">
          <template #prepend>
            <v-icon>mdi-account-circle</v-icon>
          </template>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item @click="logout()">
          <template #prepend>
            <v-icon color="error">mdi-logout</v-icon>
          </template>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>

  <!-- Navigation Drawer -->
  <v-navigation-drawer v-model="drawer" :rail="rail" permanent app>
    <v-btn
      class="rail-btn"
      variant="elevated"
      :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
      size="small"
      @click.stop="rail = !rail"
    />

    <!-- Navigation Items -->
    <v-list density="compact" nav>
      <v-list-item
        v-for="item in availableNavigationItems"
        :key="item.title"
        :to="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        :value="item.title"
        color="primary"
      />
    </v-list>

    <!-- Bottom Section -->
    <template #append>
      <v-divider />
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-help-circle" title="Help & Support" @click="() => {}" />
        <v-list-item prepend-icon="mdi-information" title="About" @click="() => {}" />
      </v-list>
    </template>
  </v-navigation-drawer>

  <v-container fluid class="pa-6">
    <router-view />
  </v-container>
</template>
<style scoped>
.rail-btn {
  position: absolute;
  right: 0;
  transform: translateX(50%);
  top: 135px;
  z-index: 1;
}

.logo-icon :deep(path) {
  fill: white;
  stroke: white;
}
</style>
