import { createClient } from '@/api/createClient.ts'
import { HttpClient } from '@/api/__generated__/qr/http-client.ts'
import { setupAuthInterceptors } from '@/api/helpers/setupAuthInterceptos.ts'

export const client = (params: any) => {
  const createdClient = createClient(HttpClient, params)

  setupAuthInterceptors(createdClient)

  return createdClient
}
