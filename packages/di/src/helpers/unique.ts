export function unique<T>(data: T[]): T[] {
  return [...new Set<T>(data ?? [])];
}
