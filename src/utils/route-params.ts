export function getFirstRouteParam<T>(value: T | T[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
