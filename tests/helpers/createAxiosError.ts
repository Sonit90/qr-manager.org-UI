import { AxiosError } from 'axios'
import type { AxiosResponse } from 'axios'

export function createAxiosError(
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response?: Partial<AxiosResponse<unknown, any>>,
): AxiosError {
  return new AxiosError(
    message,
    undefined,
    undefined,
    undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response as AxiosResponse<unknown, any>,
  )
}
