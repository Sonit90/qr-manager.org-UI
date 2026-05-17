<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue'
import LegalPage from '@/modules/legal/LegalPage.vue'
import { ApiClientQr } from '@/api/qr/ApiClientQr.ts'
import { isRequired, isValidEmail, hasMinLength } from '@/helpers/validations/validations.ts'
import { handleApiError } from '@/api/helpers/handleApiError.ts'

const contactForm = ref<Ref | null>(null)
const isLoading = ref(false)
const messageSent = ref(false)

const form = reactive({
  name: '',
  email: '',
  message: '',
})

const nameRules = [isRequired('Name')]
const emailRules = [isRequired('E-mail'), isValidEmail]
const messageRules = [isRequired('Message'), hasMinLength(10)]

async function handleSubmit() {
  if (!contactForm.value) return
  const { valid } = await contactForm.value.validate()
  if (!valid) return
  try {
    isLoading.value = true
    await ApiClientQr.submitContact({
      name: form.name,
      email: form.email,
      message: form.message,
    })
    messageSent.value = true
  } catch (e) {
    handleApiError(e, { title: 'Contact' })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <LegalPage title="Contact">
    <div class="contact-wrap">
      <p class="contact-sub">
        Got a question, idea, or bug to report? Drop a message and I'll get back to you.
      </p>

      <v-form
        v-if="!messageSent"
        ref="contactForm"
        class="contact-form"
        @submit.prevent="handleSubmit"
      >
        <v-text-field
          v-model.trim="form.name"
          :rules="nameRules"
          label="Name"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          color="primary"
          required
        />

        <v-text-field
          v-model.trim="form.email"
          :rules="emailRules"
          label="Email"
          autocomplete="email"
          prepend-inner-icon="mdi-email"
          variant="outlined"
          color="primary"
          required
        />

        <v-textarea
          v-model.trim="form.message"
          :rules="messageRules"
          label="Message"
          prepend-inner-icon="mdi-message-text"
          variant="outlined"
          color="primary"
          rows="6"
          auto-grow
          required
        />

        <button
          type="submit"
          class="app-btn app-btn-primary app-btn-lg app-btn-block"
          :disabled="isLoading"
        >
          <v-progress-circular v-if="isLoading" size="16" width="2" indeterminate />
          Send Message
        </button>
      </v-form>

      <div v-else class="contact-success" data-testid="contact-success">
        <v-icon icon="mdi-check-circle" size="64" color="success" />
        <h2 class="contact-success-title">Message sent</h2>
        <p class="contact-success-text">Thanks for reaching out. I'll reply as soon as I can.</p>
      </div>
    </div>
  </LegalPage>
</template>

<style scoped>
.contact-wrap {
  max-width: 560px;
  margin-top: 32px;
}

.contact-sub {
  color: var(--muted);
  font-size: 16px;
  margin: 0 0 28px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-success {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 32px 0;
}

.contact-success-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.contact-success-text {
  color: var(--muted);
  margin: 0;
}
</style>
