'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'

interface DateEvent {
  id: string
  date: string
  location: string
  venue: string
}

/** Confronta solo il giorno (YYYY-MM-DD) in ora locale, evita bug UTC del constructor Date(). */
function isTodayOrFutureDateString(dateStr: string): boolean {
  const parts = dateStr.trim().split('T')[0]?.split('-').map(Number)
  if (!parts || parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return false
  }
  const [y, m, d] = parts
  const eventDay = new Date(y, m - 1, d)
  eventDay.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return eventDay >= today
}

export default function Dates() {
  const [dates, setDates] = useState<DateEvent[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const response = await fetch('/api/data/dates')
        const data = await response.json()
        const parsedDates = data.dates || []
        const futureDates = parsedDates.filter((date: DateEvent) =>
          isTodayOrFutureDateString(date.date)
        )
        if (!cancelled) setDates(futureDates)
      } catch {
        if (!cancelled) setDates([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="dates" className="section-y relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />

      <div className="container relative z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Le Mie Date</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-6" />
          <p className="mx-auto max-w-3xl px-1 text-base leading-relaxed text-gray-300 sm:text-lg md:text-xl">
            Vieni a ballare: l'energia contagiosa, il mix perfetto di suoni e il mio talento nel leggere la pista faranno scatenare chiunque. Ti aspetto, porta i tuoi amici.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dates.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Calendar className="text-gray-600 mx-auto mb-4" size={48} />
              <p className="text-gray-400 text-lg">Presto nuove date in arrivo!</p>
            </div>
          ) : (
            dates.map((date, index) => (
            <motion.div
              key={date.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-effect group rounded-xl p-5 transition-all hover:border-pink-500/50 sm:p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg">
                  <Calendar className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">
                    {new Date(date.date).toLocaleDateString('it-IT', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {new Date(date.date).toLocaleDateString('it-IT', {
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <h3 className="mb-2 break-words text-lg font-bold text-white transition-colors group-hover:text-pink-500 sm:text-xl">
                {date.venue}
              </h3>
              <div className="flex items-start gap-2 text-gray-400">
                <MapPin className="mt-0.5 shrink-0" size={16} aria-hidden />
                <span className="text-sm break-words">{date.location}</span>
              </div>
            </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

