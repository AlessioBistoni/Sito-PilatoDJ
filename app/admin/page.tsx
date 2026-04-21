'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Password semplice - puoi cambiarla
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'piluz2024'
    
    if (password === adminPassword) {
      localStorage.setItem('admin_authenticated', 'true')
      router.push('/admin/dashboard')
    } else {
      setError('Password errata')
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-900 p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-safe">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md border border-gray-700">
        <div className="flex items-center justify-center mb-6">
          <Lock className="text-pink-500" size={48} />
        </div>
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          Area Admin
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
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
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-colors"
          >
            Accedi
          </button>
        </form>
      </div>
    </div>
  )
}

