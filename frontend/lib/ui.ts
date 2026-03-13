/**
 * Returns a Tailwind className string for a form input.
 * Applies red border + light red tint when `hasError` is true,
 * otherwise uses the standard indigo-focus style.
 *
 * @param hasError - whether the field currently has a validation error
 * @param extra - additional classes to append (e.g. 'text-mono')
 */
export function inputCls(hasError?: boolean, extra?: string): string {
  return [
    'w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors',
    hasError
      ? 'border-red-400 focus:ring-red-400 bg-red-50/40'
      : 'border-gray-300 focus:ring-indigo-500',
    extra ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}
