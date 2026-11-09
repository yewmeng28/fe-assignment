/**
 * Case-insensitive "does any field contain the search text?".
 * Takes a list of fields so new searchable fields (e.g. a date) can be added
 * by the caller without changing this function.
 */
export function matchesSearch(query: string, fields: string[]): boolean {
  const needle = query.trim().toLowerCase()
  if (needle === '') return true
  return fields.some((field) => field.toLowerCase().includes(needle))
}
