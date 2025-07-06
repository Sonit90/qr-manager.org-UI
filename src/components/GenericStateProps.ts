export interface GenericStateProps {
  state: 'error' | 'warning' | 'info' | 'success' | 'loading'
  title: string
  subtitle?: string
  buttonProps?: {
    path?: string
    icon?: string
    label?: string
  }
}
