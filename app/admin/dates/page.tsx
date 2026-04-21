'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Calendar } from 'lucide-react'

interface DateEvent {
  id: string
  date: string
  location: string
  venue: string
}

export default function AdminDates() {
  const router = useRouter()
  const [dates, setDates] = useState<DateEvent[]>([])
  const [supabaseConfigured, setSupabaseConfigured] = useState<boolean | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    date: '',
    location: '',
    venue: '',
  })

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    if (!isAuthenticated) {
      router.push('/admin')
      return
    }
    loadDates()
  }, [router])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newDate: DateEvent = {
      id: Date.now().toString(),
      ...formData,
    }
    const updatedDates = [...dates, newDate].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
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
        setFormData({ date: '', location: '', venue: '' })
        setShowForm(false)
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
      const updatedDates = dates.filter(date => date.id !== id)
      
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
        console.error('Errore nell\'eliminazione:', error)
        alert('Errore nell\'eliminazione della data')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/dashboard"
              className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Gestione Date</h1>
              <p className="text-gray-400">Aggiungi o rimuovi date degli eventi</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white hover:from-pink-600 hover:to-purple-600 transition-colors"
          >
            <Plus size={20} />
            <span>Nuova Data</span>
          </button>
        </div>
        {supabaseConfigured === false && (
          <div
            className="mb-6 rounded-lg border border-amber-600/50 bg-amber-950/40 p-4 text-amber-100"
            role="status"
          >
            <p className="font-semibold">Storage non disponibile</p>
            <p className="mt-1 text-sm text-amber-200/90">
              Stai usando il sito in <strong>produzione</strong> senza variabili Supabase, oppure una
              build in cui lo sviluppo locale non è attivo. Aggiungi in{' '}
              <code className="rounded bg-black/30 px-1">.env.local</code> (locale) o su Vercel le
              variabili <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_SUPABASE_URL</code> e{' '}
              <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, poi
              riavvia il server.
            </p>
            <p className="mt-2 text-xs text-amber-200/70">
              In <strong>sviluppo</strong> (<code className="rounded bg-black/30 px-1">npm run dev</code>)
              senza <code className="rounded bg-black/30 px-1">.env.local</code> i dati si salvano comunque
              nel file <code className="rounded bg-black/30 px-1">.pilato-dev/app-data.json</code>.
            </p>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Aggiungi Nuova Data</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
                  Data
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                  Città
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                  placeholder="Es: Perugia"
                  required
                />
              </div>
              <div>
                <label htmlFor="venue" className="block text-sm font-medium text-gray-300 mb-2">
                  Luogo
                </label>
                <input
                  type="text"
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                  placeholder="Es: Thebris Cafè"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-colors"
                >
                  Salva
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setFormData({ date: '', location: '', venue: '' })
                  }}
                  className="px-6 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors"
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Dates List */}
        <div className="space-y-4">
          {dates.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
              <Calendar className="text-gray-600 mx-auto mb-4" size={48} />
              <p className="text-gray-400">Nessuna data aggiunta</p>
            </div>
          ) : (
            dates.map((date) => (
              <div
                key={date.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <Calendar className="text-pink-500" size={20} />
                    <span className="text-white font-semibold text-lg">
                      {new Date(date.date).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-300">{date.venue}</p>
                  <p className="text-gray-400 text-sm">{date.location}</p>
                </div>
                <button
                  onClick={() => handleDelete(date.id)}
                  className="p-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

