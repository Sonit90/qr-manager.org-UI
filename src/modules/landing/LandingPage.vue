<script setup lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { isAuthenticated } = storeToRefs(userStore)

const features = [
  {
    icon: 'mdi-qrcode-plus',
    title: 'Create QR Codes',
    text: 'Generate QR codes for any URL in seconds. Name them for easy management.',
  },
  {
    icon: 'mdi-chart-line',
    title: 'Track Scans',
    text: 'See total scans, device types, and browser breakdowns for every QR.',
  },
  {
    icon: 'mdi-pencil',
    title: 'Update Targets',
    text: 'Change the destination URL anytime without reprinting the QR code.',
  },
  {
    icon: 'mdi-toggle-switch',
    title: 'Enable / Disable',
    text: 'Turn QR codes on or off instantly. Disabled codes show a friendly notice.',
  },
]
</script>

<template>
  <div class="landing-page">
    <section class="hero">
      <v-container>
        <v-row justify="center" class="text-center">
          <v-col cols="12" md="9" lg="7">
            <h1 class="text-h3 text-md-h2 font-weight-bold mb-4">QR Manager</h1>
            <p class="text-h6 text-md-h5 mb-8 text-medium-emphasis">
              Create dynamic QR codes, track scans, and update destinations without reprinting.
            </p>
            <div class="d-flex flex-wrap justify-center ga-3">
              <v-btn
                v-if="isAuthenticated"
                color="primary"
                size="large"
                prepend-icon="mdi-qrcode"
                to="/qrs"
              >
                Go to My QRs
              </v-btn>
              <template v-else>
                <v-btn color="primary" size="large" to="/login">Sign in</v-btn>
                <v-btn variant="outlined" size="large" to="/register">Create account</v-btn>
              </template>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <section class="features py-10">
      <v-container>
        <h2 class="text-h4 text-center mb-8">Features</h2>
        <v-row>
          <v-col v-for="f in features" :key="f.title" cols="12" sm="6" md="3">
            <v-card class="pa-4 h-100" elevation="2" rounded="lg">
              <v-icon :icon="f.icon" color="primary" size="40" class="mb-3" />
              <h3 class="text-h6 mb-2">{{ f.title }}</h3>
              <p class="text-body-2 text-medium-emphasis">{{ f.text }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <footer class="py-6 text-center text-medium-emphasis">
      <span>&copy; QR Manager</span>
    </footer>
  </div>
</template>

<style scoped>
.hero {
  background-image: linear-gradient(to bottom right, #6366f1, #8b5cf6);
  color: white;
  padding: 80px 0;
}

.hero .text-medium-emphasis {
  color: rgba(255, 255, 255, 0.85) !important;
}
</style>
