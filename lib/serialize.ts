/**
 * Utility to serialize data returned from Prisma before passing it from
 * React Server Components (RSC) or Server Actions to Client Components.
 *
 * Next.js App Router throws:
 * "Only plain objects can be passed to Client Components from Server Components. Decimal objects are not supported."
 * whenever a Prisma Decimal or complex instance is passed across the boundary.
 */

export function serializeToPlain<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle Prisma Decimal or any Decimal-like instance
  if (
    typeof data === 'object' &&
    (
      (data as any).isDecimal ||
      data.constructor?.name === 'Decimal' ||
      (typeof (data as any).toFixed === 'function' && typeof (data as any).toNumber === 'function')
    )
  ) {
    const num = Number((data as any).toString());
    return (Number.isNaN(num) ? 0 : num) as unknown as T;
  }

  // Handle Date: Preserve valid Date objects (supported by React 19 RSC)
  if (data instanceof Date) {
    return data;
  }

  // Handle Array
  if (Array.isArray(data)) {
    return data.map((item) => serializeToPlain(item)) as unknown as T;
  }

  // Handle Object (plain or instances)
  if (typeof data === 'object') {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = serializeToPlain(value);
    }
    return result as T;
  }

  return data;
}
