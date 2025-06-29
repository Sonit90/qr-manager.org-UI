import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'
import './assets/main.css'
import Notifications from '@kyvg/vue3-notification'

import App from './App.vue'
import { router } from './router/router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(Notifications)

app.mount('#app')
