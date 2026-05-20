/// <reference types="vite/client" />
declare const __BUILD_DATE__: string

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_QR_API_URL: string
  readonly VITE_FRONTEND_PORT: string
  readonly VITE_APP_NAME: string
  readonly VITE_COMPANY_NAME: string
  readonly VITE_CONTACT_EMAIL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.svg?component' {
  import type { FunctionalComponent, SVGAttributes } from 'vue'
  const component: FunctionalComponent<SVGAttributes>
  export default component
}
