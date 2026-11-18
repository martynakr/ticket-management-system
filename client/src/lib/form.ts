import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import type { ApiErrorBody } from '../types/api'

// Shows the server's per-field 400 messages under the matching inputs.
export function applyFieldErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  fields: ApiErrorBody['fields'],
): boolean {
  let applied = false
  for (const [name, messages] of Object.entries(fields ?? {})) {
    if (messages?.[0]) {
      setError(name as Path<T>, { type: 'server', message: messages[0] })
      applied = true
    }
  }
  return applied
}
