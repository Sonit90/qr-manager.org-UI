import { isAxiosError } from 'axios'
import { notify } from '@kyvg/vue3-notification'

interface NotificationPayload {
  title: string
  text: string
}

export function handleApiError(error: unknown, { title, text }: { title?: string; text?: string }) {
  const notification: NotificationPayload = {
    title: title || 'Error',
    text: text || 'Something went wrong',
  }

  if (error instanceof Error && !isAxiosError(error)) {
    notification.text = error.message || 'Something went wrong'
  } else if (isAxiosError(error)) {
    const { response } = error
    notification.text = response?.data?.detail || response?.data?.message || notification.text
  }

  notify(notification)
  return { message: notification.text }
}
