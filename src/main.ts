import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'
import './assets/main.css'
import './assets/styles/theme.css'
import Notifications from '@kyvg/vue3-notification'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import { router } from './router/router'
import { queryClient } from '@/tanstack/queryClient.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(Notifications)
app.use(VueQueryPlugin, { queryClient })

app.mount('#app')
