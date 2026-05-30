import type { AxiosInstance } from 'axios'

interface ClientConfig {
  baseURL: string
}

type ClientWithInstance = { instance: AxiosInstance }

export function makeClient<T extends ClientWithInstance>(
  HttpClient: new (config?: ClientConfig) => T,
  setup: (client: T) => void,
) {
  return (params: ClientConfig) => {
    const createdClient = new HttpClient(params)
    setup(createdClient)
    return createdClient
  }
}
