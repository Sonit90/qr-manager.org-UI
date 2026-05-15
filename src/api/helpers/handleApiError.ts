import { isAxiosError } from 'axios'
import { type NotificationsOptions, notify } from '@kyvg/vue3-notification'

export function handleApiError(error: unknown, { title, text }: { title?: string; text?: string }) {
  const notification: Partial<NotificationsOptions> = {
    title: title || 'Error',
    text: text || 'Something went wrong',
    type: 'error',
  }

  if (error instanceof Error && !isAxiosError(error)) {
    notification.text = error.message || 'Something went wrong'
  } else if (isAxiosError(error)) {
    const data = error.response?.data
    const detail = typeof data?.detail === 'string' ? data.detail : undefined
    notification.text = data?.error?.message || detail || data?.message || notification.text
  }

  notify(notification)
  return { message: notification.text }
}
