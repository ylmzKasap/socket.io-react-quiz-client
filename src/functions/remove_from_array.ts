export function removeFromArray<T>(array: T[], index: number): T[] {
  const prevItems = array.slice(0, index);
  const nextItems = array.slice(index + 1);
  return [...prevItems, ...nextItems];
}
