'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  X,
} from 'lucide-react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  type AppDateEvent,
  compareEventsByTime,
  displayStartTime,
  hasStartTime,
} from '@/lib/dates'

const WEEKDAYS_IT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

function toDateKey(y: number, m0: number, day: number) {
  return `${y}-${pad2(m0 + 1)}-${pad2(day)}`
}

function buildMonthGrid(year: number, monthIndex: number): (number | null)[] {
  const first = new Date(year, monthIndex, 1)
  const last = new Date(year, monthIndex + 1, 0)
  const startMonday = (first.getDay() + 6) % 7
  const daysInMonth = last.getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < startMonday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  const remainder = cells.length % 7
  if (remainder !== 0) {
    for (let i = 0; i < 7 - remainder; i++) cells.push(null)
  }
  return cells
}

export type DatesCalendarProps = {
  events: AppDateEvent[]
  /**
   * Se true, al caricamento o cambio elenco, il mese mostrato salta a quello del
   * primo evento in ordine di data. Sul sito pubblico è desiderabile; in admin
   * di solito resta il mese corrente.
   */
  snapViewToFirstEvent?: boolean
  /** `id` del titolo in modale (accessibilità) */
  modalTitleId?: string
  /** `z-index` del modale, utile sotto eventuali header admin fissi */
  modalZIndexClass?: string
  className?: string
}

export function DatesCalendar({
  events,
  snapViewToFirstEvent = false,
  modalTitleId = 'dates-modal-title',
  modalZIndexClass = 'z-50',
  className = '',
}: DatesCalendarProps) {
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [openDay, setOpenDay] = useState<{
    dateKey: string
    events: AppDateEvent[]
    day: number
  } | null>(null)

  const closeModal = useCallback(() => setOpenDay(null), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeModal])

  useEffect(() => {
    if (openDay) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [openDay])

  useEffect(() => {
    if (!snapViewToFirstEvent) return
    if (events.length === 0) return
    const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date))
    const raw = sorted[0].date.split('T')[0] ?? ''
    const p = raw.split('-').map(Number)
    if (p.length === 3 && !p.some(Number.isNaN)) {
      setViewDate(new Date(p[0], p[1] - 1, 1))
    }
  }, [events, snapViewToFirstEvent])

  const y = viewDate.getFullYear()
  const m = viewDate.getMonth()

  const eventByKey = useMemo(() => {
    const map = new Map<string, AppDateEvent[]>()
    for (const ev of events) {
      const key = (ev.date.split('T')[0] ?? '').trim()
      if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(ev)
    }
    Array.from(map.values()).forEach((arr) => {
      arr.sort(compareEventsByTime)
    })
    return map
  }, [events])

  const monthLabel = useMemo(
    () =>
      viewDate.toLocaleDateString('it-IT', {
        month: 'long',
        year: 'numeric',
      }),
    [viewDate]
  )

  const grid = useMemo(() => buildMonthGrid(y, m), [y, m])

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const isTodayCell = (day: number) =>
    y === today.getFullYear() && m === today.getMonth() && day === today.getDate()

  const isPastCell = (day: number) => {
    const cell = new Date(y, m, day)
    cell.setHours(0, 0, 0, 0)
    return cell < today
  }

  const goMonth = (delta: number) => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1))
  }

  const modalTitleDate =
    openDay &&
    new Date(
      openDay.dateKey + 'T12:00:00'
    ).toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  return (
    <>
      <div className={`mx-auto w-full max-w-5xl lg:max-w-6xl ${className}`.trim()}>
        <div className="glass-effect overflow-hidden rounded-2xl border border-white/15 p-5 sm:p-7 md:p-8">
          <div className="mb-4 flex items-center justify-between gap-2 sm:mb-6">
            <button
              type="button"
              onClick={() => goMonth(-1)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/20 text-white/80 transition hover:border-pink-500/50 hover:text-pink-300"
              aria-label="Mese precedente"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3 className="text-center text-lg font-bold capitalize text-white sm:text-2xl">
              {monthLabel}
            </h3>
            <button
              type="button"
              onClick={() => goMonth(1)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/20 text-white/80 transition hover:border-pink-500/50 hover:text-pink-300"
              aria-label="Mese successivo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1.5 sm:gap-2 md:gap-3">
            {WEEKDAYS_IT.map((name) => (
              <div
                key={name}
                className="py-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:py-2 sm:text-xs md:text-sm"
              >
                {name}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 md:gap-3">
            {grid.map((cell, i) => {
              if (cell === null) {
                return (
                  <div
                    key={`e-${i}`}
                    className="min-h-[7.5rem] sm:min-h-32 md:min-h-36"
                  />
                )
              }
              const key = toDateKey(y, m, cell)
              const dayEvents = eventByKey.get(key) ?? []
              const hasEvent = dayEvents.length > 0
              const past = isPastCell(cell)
              const todayC = isTodayCell(cell)

              const baseCell = [
                'min-h-[7.5rem] w-full min-w-0 rounded-lg border sm:min-h-32 md:min-h-36',
                past && !hasEvent
                  ? 'border-white/5 bg-white/[0.03] text-gray-600'
                  : hasEvent
                    ? 'border-pink-500/60 bg-gradient-to-br from-pink-500/20 to-purple-500/15 text-white shadow-[0_0_0_1px_rgba(236,72,153,0.25)]'
                    : 'border-white/10 bg-white/[0.04] text-gray-300',
                todayC ? 'ring-1 ring-cyan-400/50' : '',
              ]
                .filter(Boolean)
                .join(' ')

              if (hasEvent) {
                const primary = dayEvents[0]!
                const more = dayEvents.length - 1
                const fullLabel = dayEvents
                  .map((ev) => {
                    const t = displayStartTime(ev.startTime)
                    const timePart = t ? `, ${t}` : ''
                    return `${ev.venue} — ${ev.location}${timePart}`
                  })
                  .join(' | ')
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setOpenDay({ dateKey: key, events: dayEvents, day: cell })}
                    className={
                      baseCell +
                      ' flex flex-col items-stretch justify-start gap-1 p-1.5 text-left transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 sm:gap-1.5 sm:p-2 md:p-2.5'
                    }
                    title={fullLabel}
                    aria-label={`Apri dettagli per il ${cell}, ${dayEvents.length} evento${dayEvents.length > 1 ? 'i' : ''}`}
                  >
                    <span className="shrink-0 text-center text-base font-extrabold leading-none text-white sm:text-lg md:text-xl">
                      {cell}
                    </span>
                    <span className="line-clamp-2 w-full break-words text-left text-xs font-semibold leading-snug text-pink-100 sm:text-sm">
                      {primary.venue}
                    </span>
                    {hasStartTime(primary.startTime) && (
                      <div className="flex min-w-0 items-center justify-center gap-0.5 text-[0.65rem] font-medium tabular-nums text-cyan-200/95 sm:justify-start sm:text-xs">
                        <Clock className="h-3 w-3 shrink-0" aria-hidden />
                        <span>{displayStartTime(primary.startTime)}</span>
                      </div>
                    )}
                    <div className="flex min-h-0 w-full min-w-0 items-start gap-0.5 text-left">
                      <MapPin
                        className="mt-0.5 h-3 w-3 shrink-0 text-pink-300/90 sm:h-3.5 sm:w-3.5"
                        aria-hidden
                      />
                      <span className="line-clamp-2 w-full min-w-0 break-words text-[0.7rem] leading-tight text-white/85 sm:text-xs md:text-sm">
                        {primary.location}
                      </span>
                    </div>
                    {more > 0 && (
                      <span className="text-center text-[0.65rem] font-medium text-pink-200/90 sm:text-xs">
                        +{more} {more === 1 ? 'altra' : 'altre'}
                      </span>
                    )}
                  </button>
                )
              }

              return (
                <div
                  key={key}
                  className={
                    baseCell + ' flex items-center justify-center text-sm font-bold sm:text-base md:text-lg'
                  }
                >
                  {cell}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {openDay && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalTitleId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 ${modalZIndexClass} flex items-end justify-center bg-black/75 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center sm:p-6`}
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="max-h-[min(85vh,640px)] w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-zinc-950/95 shadow-2xl backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 border-b border-white/10 p-4 sm:p-5">
                <div>
                  <p id={modalTitleId} className="text-lg font-bold text-white sm:text-xl">
                    {modalTitleDate}
                  </p>
                  <p className="text-sm text-gray-400">
                    {openDay.events.length} evento
                    {openDay.events.length !== 1 ? 'i' : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="shrink-0 rounded-lg border border-white/20 p-2 text-gray-400 transition hover:border-pink-500/50 hover:text-white"
                  aria-label="Chiudi"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ul className="max-h-[min(60vh,480px)] space-y-3 overflow-y-auto p-4 sm:p-5">
                {openDay.events.map((ev) => (
                  <li
                    key={ev.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4"
                  >
                    <p className="mb-1 font-bold text-pink-300">{ev.venue}</p>
                    {hasStartTime(ev.startTime) && (
                      <div className="mb-2 flex items-center gap-2 text-sm text-cyan-200/90">
                        <Clock className="h-4 w-4 shrink-0" aria-hidden />
                        <span className="font-medium tabular-nums">
                          Inizio {displayStartTime(ev.startTime)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-start gap-2 text-sm text-gray-300">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" aria-hidden />
                      <span className="break-words">{ev.location}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
