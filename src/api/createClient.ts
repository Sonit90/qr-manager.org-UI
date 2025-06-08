type Constructor<T> = new (...args: any[]) => T

export function createClient<T>(api: Constructor<T>) {
  return new api()
}
