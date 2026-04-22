'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, MapPin, Plus, Trash2, X } from 'lucide-react'
import { type AppDateEvent, hasStartTime } from '@/lib/dates'
import { DatesCalendar } from '@/components/DatesCalendar'

export default function AdminDates() {
  const [dates, setDates] = useState<AppDateEvent[]>([])
  const [supabaseConfigured, setSupabaseConfigured] = useState<boolean | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    date: '',
    location: '',
    venue: '',
    startTime: '',
  })

  useEffect(() => {
    void loadDates()
  }, [])

  const loadDates = async () => {
    try {
      const response = await fetch('/api/data/dates')
      const data = await response.json()
      setDates(data.dates || [])
      if (typeof data.configured === 'boolean') {
        setSupabaseConfigured(data.configured)
      }
    } catch (error) {
      console.error('Errore nel caricamento delle date:', error)
      setDates([])
    }
  }

  const resetForm = () => {
    setFormData({ date: '', location: '', venue: '', startTime: '' })
  }

  const closeForm = useCallback(() => {
    setShowForm(false)
    resetForm()
  }, [])

  useEffect(() => {
    if (!showForm) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeForm()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [showForm, closeForm])

  useEffect(() => {
    if (showForm) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [showForm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newDate: AppDateEvent = {
      id: Date.now().toString(),
      date: formData.date,
      location: formData.location,
      venue: formData.venue,
      ...(formData.startTime.trim() ? { startTime: formData.startTime.trim() } : {}),
    }
    const updatedDates = [...dates, newDate].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    try {
      const response = await fetch('/api/data/dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dates: updatedDates }),
      })
      const payload = await response.json().catch(() => ({}))

      if (response.ok) {
        setDates(updatedDates)
        closeForm()
      } else {
        const msg =
          typeof payload.error === 'string'
            ? payload.error
            : `Salvataggio non riuscito (${response.status})`
        alert(msg)
      }
    } catch (error) {
      console.error('Errore nel salvataggio:', error)
      alert('Errore nel salvataggio della data')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questa data?')) {
      const updatedDates = dates.filter((date) => date.id !== id)

      try {
        const response = await fetch('/api/data/dates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dates: updatedDates }),
        })
        const payload = await response.json().catch(() => ({}))

        if (response.ok) {
          setDates(updatedDates)
        } else {
          const msg =
            typeof payload.error === 'string'
              ? payload.error
              : `Eliminazione non riuscita (${response.status})`
          alert(msg)
        }
      } catch (error) {
        console.error("Errore nell'eliminazione:", error)
        alert("Errore nell'eliminazione della data")
      }
    }
  }

  const sortedDates = useMemo(
    () =>
      [...dates].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [dates]
  )

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/15 to-black" />
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <Link
              href="/admin/dashboard"
              className="tap-target rounded-xl border border-white/20 text-white/90 transition hover:border-pink-500/50 hover:text-pink-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">
                <span className="text-gradient">Le Mie Date</span>
              </h1>
              <p className="mt-1 text-sm text-white/60 sm:text-base">
                Aggiungi serate con orario, luogo e città
              </p>
              <div className="mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 text-sm font-semibold shadow-lg transition hover:from-pink-600 hover:to-purple-600 sm:self-start"
          >
            <Plus className="h-5 w-5" />
            <span>Nuova data</span>
          </button>
        </div>

        {supabaseConfigured === false && (
          <div
            className="mb-8 rounded-2xl border border-amber-500/40 bg-amber-950/50 p-5 text-amber-100"
            role="status"
          >
            <p className="font-semibold">Storage non disponibile</p>
            <p className="mt-2 text-sm text-amber-200/90">
              Imposta in <code className="rounded bg-black/40 px-1.5">.env.local</code> o su Vercel{' '}
              <code className="rounded bg-black/40 px-1.5">NEXT_PUBLIC_SUPABASE_URL</code> e{' '}
              <code className="rounded bg-black/40 px-1.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, poi
              riavvia il server. In dev senza <code className="rounded bg-black/40 px-1.5">.env.local</code>{' '}
              i dati vanno in <code className="rounded bg-black/40 px-1.5">.pilato-dev/app-data.json</code>
              .
            </p>
          </div>
        )}

        <div className="mb-8">
          <h2 className="mb-1 text-lg font-bold text-white sm:text-xl">Calendario</h2>
          <p className="mb-4 text-sm text-white/50"></p>
          <DatesCalendar
            events={sortedDates}
            snapViewToFirstEvent={false}
            modalTitleId="admin-dates-modal-title"
          />
        </div>

        <div className="space-y-4">
          {sortedDates.length === 0 ? (
            <div className="glass-effect rounded-2xl border border-white/10 py-20 text-center">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-white/30" />
              <p className="text-white/50">Nessuna data: aggiungi la prima serata con il pulsante sopra</p>
            </div>
          ) : (
            sortedDates.map((date) => {
              const dateLine = new Date(date.date + 'T12:00:00').toLocaleDateString('it-IT', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
              return (
                <div
                  key={date.id}
                  className="glass-effect flex flex-col gap-4 rounded-2xl border border-white/15 p-5 sm:flex-row sm:items-stretch sm:justify-between sm:p-6"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-baseline gap-2">
                      <span className="text-lg font-extrabold text-white sm:text-xl">{dateLine}</span>
                    </div>
                    <p className="text-base font-bold leading-snug text-pink-200 sm:text-lg">
                      {date.venue}
                    </p>
                    {hasStartTime(date.startTime) && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-cyan-200/95">
                        <Clock className="h-4 w-4 shrink-0" aria-hidden />
                        <span className="font-medium tabular-nums">Inizio {date.startTime}</span>
                      </div>
                    )}
                    <div className="mt-2 flex items-start gap-2 text-sm text-white/80 sm:text-base">
                      <MapPin
                        className="mt-0.5 h-4 w-4 shrink-0 text-pink-300/80"
                        aria-hidden
                      />
                      <span className="break-words">{date.location}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 sm:flex-col sm:justify-center">
                    <button
                      type="button"
                      onClick={() => handleDelete(date.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300 transition hover:border-red-400/60 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sm:hidden">Elimina</span>
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="admin-new-date-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center sm:p-6"
              onClick={closeForm}
            >
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                className="max-h-[min(90vh,720px)] w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-zinc-950/95 shadow-2xl backdrop-blur-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-3 border-b border-white/10 p-4 sm:p-5">
                  <h2
                    id="admin-new-date-title"
                    className="text-xl font-bold text-white sm:text-2xl"
                  >
                    Nuova serata
                  </h2>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="shrink-0 rounded-lg border border-white/20 p-2 text-gray-400 transition hover:border-pink-500/50 hover:text-white"
                    aria-label="Chiudi"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="max-h-[min(75vh,600px)] space-y-5 overflow-y-auto p-4 sm:p-5"
                >
                  <div>
                    <label htmlFor="date" className="mb-2 block text-sm font-medium text-white/80">
                      Data
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-pink-500/50"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="venue" className="mb-2 block text-sm font-medium text-white/80">
                      Nome serata / locale
                    </label>
                    <input
                      type="text"
                      id="venue"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-pink-500/50"
                      placeholder="Es. Thebris Cafè"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="mb-2 block text-sm font-medium text-white/80">
                      Città
                    </label>
                    <input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-pink-500/50"
                      placeholder="Es. Perugia"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="startTime"
                      className="mb-2 block text-sm font-medium text-white/80"
                    >
                      Ora di inizio <span className="font-normal text-white/50">(opzionale)</span>
                    </label>
                    <input
                      type="time"
                      id="startTime"
                      step={60}
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full max-w-xs rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-pink-500/50"
                    />
                    <p className="mt-1.5 text-xs text-white/45">
                      Compare nel calendario del sito accanto a luogo e città.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <button
                      type="submit"
                      className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 font-semibold transition hover:from-pink-600 hover:to-purple-600"
                    >
                      Salva
                    </button>
                    <button
                      type="button"
                      onClick={closeForm}
                      className="rounded-xl border border-white/20 px-6 py-3 font-medium text-white/90 transition hover:border-pink-500/50 hover:text-pink-200"
                    >
                      Annulla
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
