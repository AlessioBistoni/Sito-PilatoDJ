export interface AppDateEvent {
  id: string
  date: string
  location: string
  venue: string
  /** Ora inizio locale (es. "22:30") da `input type="time"`. */
  startTime?: string
}

export function hasStartTime(t?: string | null): boolean {
  return Boolean(t && String(t).trim() !== '')
}

export function displayStartTime(t?: string | null): string {
  if (!hasStartTime(t)) return ''
  return String(t).trim()
}

export function compareEventsByTime(a: AppDateEvent, b: AppDateEvent): number {
  const ha = hasStartTime(a.startTime)
  const hb = hasStartTime(b.startTime)
  if (ha && hb) {
    const c = a.startTime!.trim().localeCompare(b.startTime!.trim(), 'it')
    if (c !== 0) return c
  } else if (ha && !hb) return -1
  else if (!ha && hb) return 1
  return a.venue.localeCompare(b.venue, 'it') || a.id.localeCompare(b.id)
}
