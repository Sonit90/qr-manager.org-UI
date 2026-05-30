import { HttpClient } from '@/api/__generated__/v1/http-client.ts'
import { setupAuthInterceptors } from '@/api/helpers/setupAuthInterceptors.ts'
import { makeClient } from '@/api/makeClient.ts'

export const client = makeClient(HttpClient, setupAuthInterceptors)
