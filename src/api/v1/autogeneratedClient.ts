import { createClient } from '@/api/createClient.ts'
import { HttpClient } from '@/api/__generated__/v1/http-client.ts'

export const client = () => createClient(HttpClient)
