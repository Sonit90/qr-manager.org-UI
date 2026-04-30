import { vi } from 'vitest'

/**
 * Creates a mock function that returns a promise resolved or rejected after a delay.
 *
 * @param value - The value to resolve or reject with.
 * @param delay - Delay in milliseconds (default: 100).
 * @param shouldReject - If true, the promise will reject instead of resolve.
 * @returns A Vitest mock function returning a delayed promise.
 */
export function mockWithDelay<T>(value?: T, delay = 100, shouldReject = false) {
  return vi.fn((): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      setTimeout(() => {
        if (shouldReject) {
          reject(value)
        } else {
          resolve(value)
        }
      }, delay)
    })
  })
}
