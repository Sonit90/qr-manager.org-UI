export const isRequired = (fieldName: string) => (v: string) => !!v || `${fieldName} is required`
export const isValidEmail = (v: string) => /.+@.+\..+/.test(v) || 'Invalid email format'
export const hasMinLength = (minLength: number) => (v: string) =>
  (v && v.length >= minLength) || `Must be at least ${minLength} characters`

export const hasLowercase = (v: string) =>
  /(?=.*[a-z])/.test(v) || 'Must contain at least one lowercase letter'
export const hasUppercase = (v: string) =>
  /(?=.*[A-Z])/.test(v) || 'Must contain at least one uppercase letter'
export const hasNumber = (v: string) => /(?=.*\d)/.test(v) || 'Must contain at least one number'

export const matchesPassword = (passwordValue: string) => (v: string) =>
  v === passwordValue || 'Passwords do not match'
