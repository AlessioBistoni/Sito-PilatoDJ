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

export default function Dates() {
  const [dates, setDates] = useState<DateEvent[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    if (typeof window === 'undefined') return

    const loadDates = () => {
      const savedDates = localStorage.getItem('dates')
      if (savedDates) {
        const parsedDates = JSON.parse(savedDates)
        // Filtra solo le date future
        const futureDates = parsedDates.filter((date: DateEvent) => 
          new Date(date.date) >= new Date()
        )
        setDates(futureDates)
      }
    }

    loadDates()
    
    // Ascolta i cambiamenti nel localStorage
    const handleStorageChange = () => {
      loadDates()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Polling per aggiornare quando si modifica nella stessa finestra
    const interval = setInterval(loadDates, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  return (
    <section id="dates" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Le Mie Date</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-6" />
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Vieni a ballare: l'energia contagiosa, il mix perfetto di suoni e il mio talento nel leggere la pista faranno scatenare chiunque. Ti aspetto, porta i tuoi amici.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
              className="glass-effect rounded-xl p-6 hover:border-pink-500/50 transition-all group"
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
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-500 transition-colors">
                {date.venue}
              </h3>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin size={16} />
                <span className="text-sm">{date.location}</span>
              </div>
            </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

