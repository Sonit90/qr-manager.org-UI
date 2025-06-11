type TypedConstructor<T> = new () => T

export function createClient<T>(api: TypedConstructor<T>): T {
  return new api()
}
