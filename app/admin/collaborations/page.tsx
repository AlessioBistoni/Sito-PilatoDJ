'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Users } from 'lucide-react'
import type { CollaborationPartner } from '@/lib/collaborations'
import BlogImage from '@/components/BlogImage'

export default function AdminCollaborations() {
  const router = useRouter()
  const [partners, setPartners] = useState<CollaborationPartner[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', websiteUrl: '' })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [supabaseConfigured, setSupabaseConfigured] = useState<boolean | null>(null)

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    if (!isAuthenticated) {
      router.push('/admin')
      return
    }
    loadPartners()
  }, [router])

  const loadPartners = async () => {
    try {
      const response = await fetch('/api/data/collaborations', { cache: 'no-store' })
      const data = await response.json()
      if (typeof data.configured === 'boolean') {
        setSupabaseConfigured(data.configured)
      }
      setPartners(Array.isArray(data.partners) ? data.partners : [])
    } catch (error) {
      console.error('Errore nel caricamento collaborazioni:', error)
      setPartners([])
    }
  }

  const persistPartners = async (next: CollaborationPartner[]) => {
    const response = await fetch('/api/data/collaborations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partners: next }),
      cache: 'no-store',
    })
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}))
      const msg =
        typeof (payload as { error?: string }).error === 'string'
          ? (payload as { error: string }).error
          : 'Impossibile salvare l’elenco.'
      throw new Error(msg)
    }
    setPartners(next)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setSelectedFile(file)
    setUploadError(null)
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = formData.name.trim()
    if (!name) {
      setUploadError('Inserisci il nome del partner o della location')
      return
    }
    if (!selectedFile) {
      setUploadError('Seleziona il file del logo')
      return
    }

    setUploading(true)
    setUploadError(null)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', selectedFile)
      const uploadRes = await fetch('/api/upload-collaboration-logo', {
        method: 'POST',
        body: uploadFormData,
      })
      const uploadJson = (await uploadRes.json()) as { error?: string; path?: string }
      if (!uploadRes.ok) {
        throw new Error(uploadJson.error || 'Errore durante l’upload del logo')
      }
      const imageUrl = typeof uploadJson.path === 'string' ? uploadJson.path : ''
      if (!imageUrl) {
        throw new Error('Risposta upload senza URL')
      }

      const website = formData.websiteUrl.trim()
      const newPartner: CollaborationPartner = {
        id: Date.now().toString(),
        name,
        imageUrl,
        ...(website ? { websiteUrl: website } : {}),
      }

      await persistPartners([...partners, newPartner])
      setFormData({ name: '', websiteUrl: '' })
      setSelectedFile(null)
      setPreview(null)
      setShowForm(false)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Errore durante il salvataggio')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Rimuovere questo partner dall’elenco?')) return
    const row = partners.find((p) => p.id === id)
    if (!row) return
    const next = partners.filter((p) => p.id !== id)
    try {
      await persistPartners(next)
      const src = row.imageUrl
      const isRemote = src.startsWith('http://') || src.startsWith('https://')
      const isLocalPublic = src.startsWith('/immagini/')
      if (isRemote || isLocalPublic) {
        try {
          await fetch(`/api/delete-image?path=${encodeURIComponent(src)}`, {
            method: 'DELETE',
            cache: 'no-store',
          })
        } catch (e) {
          console.error('Errore eliminazione file logo:', e)
        }
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Errore nel salvataggio')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/dashboard"
              className="rounded-lg border border-gray-700 bg-gray-800 p-2 text-white transition-colors hover:bg-gray-700"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Collaborazioni</h1>
              <p className="text-gray-400">Loghi dei partner mostrati in homepage</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowForm((v) => !v)
              setUploadError(null)
            }}
            className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 text-white transition-colors hover:from-pink-600 hover:to-purple-600"
          >
            <Plus size={20} />
            <span>Aggiungi logo</span>
          </button>
        </div>

        {supabaseConfigured === false && (
          <div
            className="mb-6 rounded-lg border border-amber-600/50 bg-amber-950/40 p-4 text-amber-100"
            role="status"
          >
            <p className="font-semibold">Supabase non configurato</p>
            <p className="mt-1 text-sm text-amber-200/90">
              In sviluppo i dati si salvano in{' '}
              <code className="rounded bg-black/30 px-1">.pilato-dev/app-data.json</code> e i file
              in <code className="rounded bg-black/30 px-1">public/immagini/caricate/</code>.
            </p>
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 rounded-lg border border-gray-700 bg-gray-800 p-6"
          >
            <h2 className="mb-4 text-lg font-semibold text-white">Nuovo partner</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-400">Nome (es. nome locale)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-white"
                  placeholder="Nome visibile e testo alternativo del logo"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">
                  Sito web (opzionale, il logo diventerà un link)
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData((p) => ({ ...p, websiteUrl: e.target.value }))}
                  className="w-full rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-white"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">Logo (PNG o JPG)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-pink-600 file:px-4 file:py-2 file:text-white"
                />
                {preview && (
                  <div className="relative mt-3 h-24 w-40 overflow-hidden rounded-lg border border-gray-600 bg-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="" className="h-full w-full object-contain p-2" />
                  </div>
                )}
              </div>
              {uploadError && <p className="text-sm text-red-400">{uploadError}</p>}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="rounded-lg bg-pink-600 px-4 py-2 text-white hover:bg-pink-700 disabled:opacity-50"
                >
                  {uploading ? 'Caricamento…' : 'Salva e aggiungi'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setFormData({ name: '', websiteUrl: '' })
                    setSelectedFile(null)
                    setPreview(null)
                    setUploadError(null)
                  }}
                  className="rounded-lg border border-gray-600 px-4 py-2 text-gray-300 hover:bg-gray-700"
                >
                  Annulla
                </button>
              </div>
            </div>
          </form>
        )}

        {partners.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-600 bg-gray-800/50 p-12 text-center">
            <Users className="mx-auto mb-4 text-gray-500" size={40} />
            <p className="text-gray-400">Nessun logo ancora. Aggiungi il primo con il pulsante sopra.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {partners.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-4 rounded-lg border border-gray-700 bg-gray-800 p-4"
              >
                <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-md border border-gray-600 bg-black/30">
                  <BlogImage
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    objectFit="contain"
                    className="p-1"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white">{p.name}</p>
                  {p.websiteUrl ? (
                    <p className="truncate text-sm text-gray-400">{p.websiteUrl}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  className="shrink-0 rounded-lg border border-red-900/50 bg-red-950/40 p-2 text-red-300 hover:bg-red-900/50"
                  aria-label={`Elimina ${p.name}`}
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
