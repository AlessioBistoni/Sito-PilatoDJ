'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { type AppDateEvent } from '@/lib/dates'
import { DatesCalendar } from '@/components/DatesCalendar'

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
  const [dates, setDates] = useState<AppDateEvent[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const response = await fetch('/api/data/dates')
        const data = await response.json()
        const parsedDates: AppDateEvent[] = data.dates || []
        const futureDates = parsedDates.filter((date) =>
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
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center sm:mb-10"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="text-gradient">Le Mie Date</span>
          </h2>
          <div className="mx-auto h-1 w-24 bg-gradient-to-r from-pink-500 to-purple-500" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <DatesCalendar events={dates} snapViewToFirstEvent />
        </motion.div>
      </div>
    </section>
  )
}
