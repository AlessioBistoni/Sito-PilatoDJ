'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'same-origin',
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Accesso negato')
        return
      }
      const params = new URLSearchParams(
        typeof window !== 'undefined' ? window.location.search : ''
      )
      const next = params.get('next')
      if (next && next.startsWith('/admin/')) {
        router.push(next)
        router.refresh()
        return
      }
      router.push('/admin/dashboard')
      router.refresh()
    } catch {
      setError('Errore di rete. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-900 p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-safe">
      <div className="w-full max-w-md rounded-lg border border-gray-700 bg-gray-800 p-8">
        <div className="mb-6 flex items-center justify-center">
          <Lock className="text-pink-500" size={48} />
        </div>
        <h1 className="mb-6 text-center text-2xl font-bold text-white">Area Admin</h1>
        <p className="mb-4 text-center text-sm text-gray-400">
          La password non è nel codice pubblico del sito: viene verificata solo sul server dopo l&apos;invio.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              className="min-h-[48px] w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-base text-white focus:border-pink-500 focus:outline-none"
              placeholder="Inserisci la password"
              required
              autoComplete="current-password"
            />
          </div>
          {error ? <p className="text-center text-sm text-red-400">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-3 font-semibold text-white transition-colors hover:from-pink-600 hover:to-purple-600 disabled:opacity-50"
          >
            {loading ? 'Accesso…' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  )
}
