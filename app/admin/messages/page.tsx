'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Trash2, Mail } from 'lucide-react'
import type { ContactMessage } from '@/lib/contact-messages'

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void load()
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/data/contact-messages', { cache: 'no-store' })
      const data = await res.json()
      setMessages(Array.isArray(data.messages) ? data.messages : [])
    } catch {
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare questo messaggio?')) return
    const next = messages.filter((m) => m.id !== id)
    try {
      const res = await fetch('/api/data/contact-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
        cache: 'no-store',
      })
      if (!res.ok) {
        const p = await res.json().catch(() => ({}))
        const msg =
          typeof (p as { error?: string }).error === 'string'
            ? (p as { error: string }).error
            : 'Salvataggio non riuscito'
        alert(msg)
        return
      }
      setMessages(next)
    } catch {
      alert('Errore di rete')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/admin/dashboard"
            className="rounded-lg border border-gray-700 bg-gray-800 p-2 text-white transition-colors hover:bg-gray-700"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Messaggi dal sito</h1>
            <p className="text-gray-400">Richieste inviate dal modulo contatti</p>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400">Caricamento…</p>
        ) : messages.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-600 bg-gray-800/50 p-12 text-center">
            <Mail className="mx-auto mb-4 text-gray-500" size={40} />
            <p className="text-gray-400">Nessun messaggio ancora.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {messages.map((m) => (
              <li
                key={m.id}
                className="rounded-lg border border-gray-700 bg-gray-800 p-4 sm:p-5"
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-white">{m.name}</p>
                    <p className="text-sm text-pink-400">
                      <a href={`mailto:${m.email}`} className="hover:underline">
                        {m.email}
                      </a>
                    </p>
                    {m.phone ? (
                      <p className="text-sm text-gray-400">
                        <a href={`tel:${m.phone.replace(/\s/g, '')}`} className="hover:text-white">
                          {m.phone}
                        </a>
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <time className="text-xs text-gray-500" dateTime={m.createdAt}>
                      {formatDate(m.createdAt)}
                    </time>
                    <button
                      type="button"
                      onClick={() => handleDelete(m.id)}
                      className="rounded-lg border border-red-900/50 bg-red-950/40 p-2 text-red-300 hover:bg-red-900/50"
                      aria-label="Elimina messaggio"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">{m.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
