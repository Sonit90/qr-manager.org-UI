type ConstructorParameters<T> = T extends new (...args: infer P) => any ? P : never

export function createClient<T extends object>(
  Constructor: new (...args: any[]) => T,
  parameters: ConstructorParameters<typeof Constructor> = [] as any,
): T {
  return new Constructor(parameters)
}
