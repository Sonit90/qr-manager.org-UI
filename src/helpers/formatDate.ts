const format = (dateString: string | undefined, options: Intl.DateTimeFormatOptions) => {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleString('en-US', options)
}

export const formatDate = (dateString: string | undefined) =>
  format(dateString, { year: 'numeric', month: 'short', day: 'numeric' })

export const formatDateTime = (dateString: string | undefined) =>
  format(dateString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
