'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import {
  type GalleryImage,
  DEFAULT_GALLERY_IMAGES,
  formatGalleryEventDate,
  galleryCaptionTitle,
  parseGalleryListFromJson,
} from '@/lib/gallery'

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    alt: '',
    eventTitle: '',
    eventDate: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [supabaseConfigured, setSupabaseConfigured] = useState<boolean | null>(null)
  /** Stesse 8 anteprime del sito: senza `configured` l'API manda elenco vuoto. */
  const [isSitePlaceholder, setIsSitePlaceholder] = useState(false)

  useEffect(() => {
    void loadImages()
  }, [])

  const loadImages = async () => {
    try {
      const response = await fetch('/api/data/gallery', { cache: 'no-store' })
      const data = await response.json()
      if (typeof data.configured === 'boolean') {
        setSupabaseConfigured(data.configured)
      }

      const configured = data.configured === true
      const parsed = parseGalleryListFromJson(data.images)

      if (configured) {
        setImages(parsed)
        setIsSitePlaceholder(false)
      } else {
        // Stessa logica del sito: senza app_data l'array è [] ma in homepage vedi le 8 predefinite
        setImages(parsed.length > 0 ? parsed : DEFAULT_GALLERY_IMAGES)
        setIsSitePlaceholder(parsed.length === 0)
      }
    } catch (error) {
      console.error('Errore nel caricamento delle immagini:', error)
      setImages(DEFAULT_GALLERY_IMAGES)
      setIsSitePlaceholder(true)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadError(null)
      // Crea preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      setUploadError('Seleziona un\'immagine')
      return
    }

    setUploading(true)
    setUploadError(null)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', selectedFile)
      uploadFormData.append('alt', formData.alt || selectedFile.name)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante l\'upload')
      }

      const title = formData.eventTitle.trim()
      const altText = formData.alt.trim() || title || data.alt
      const newImage: GalleryImage = {
        id: Date.now().toString(),
        src: data.path,
        alt: altText,
        ...(title ? { eventTitle: title } : {}),
        ...(formData.eventDate.trim() ? { eventDate: formData.eventDate.trim() } : {}),
      }

      const updatedImages = [...images, newImage]
      
      // Salva su API
      const saveResponse = await fetch('/api/data/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: updatedImages }),
      })
      
      if (saveResponse.ok) {
        setImages(updatedImages)
        // Reset form
        setFormData({ alt: '', eventTitle: '', eventDate: '' })
        setSelectedFile(null)
        setPreview(null)
        setShowForm(false)
      } else {
        throw new Error('Errore nel salvataggio della lista immagini')
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Errore durante l\'upload')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (isSitePlaceholder) {
      alert(
        'Sono le stesse 8 anteprime mostrate in homepage. Per modificare l’elenco, configura lo storage in .env, poi carica e salva le tue immagini.'
      )
      return
    }

    if (!confirm('Sei sicuro di voler eliminare questa immagine?')) {
      return
    }

    const imageToDelete = images.find(img => img.id === id)
    if (!imageToDelete) return

    const updatedImages = images.filter(img => img.id !== id)

    try {
      const response = await fetch('/api/data/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: updatedImages }),
        cache: 'no-store',
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        const msg =
          typeof (payload as { error?: string }).error === 'string'
            ? (payload as { error: string }).error
            : "Impossibile aggiornare l'elenco in database."
        alert(msg)
        return
      }

      setImages(updatedImages)

      // Dopo il salvataggio, rimuove il file (Supabase o public/immagini/)
      if (!imageToDelete.id.startsWith('default-')) {
        const src = imageToDelete.src
        const isRemote = src.startsWith('http://') || src.startsWith('https://')
        const isLocalPublic = src.startsWith('/immagini/')
        if (isRemote || isLocalPublic) {
          try {
            await fetch(`/api/delete-image?path=${encodeURIComponent(src)}`, {
              method: 'DELETE',
              cache: 'no-store',
            })
          } catch (error) {
            console.error("Errore durante l'eliminazione del file:", error)
          }
        }
      }
    } catch (error) {
      console.error("Errore nell'eliminazione:", error)
      alert("Errore nell'eliminazione dell'immagine")
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
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
              <h1 className="text-3xl font-bold text-white">Gestione Gallery</h1>
              <p className="text-gray-400">Aggiungi o rimuovi immagini delle serate</p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white hover:from-pink-600 hover:to-purple-600 transition-colors"
          >
            <Plus size={20} />
            <span>Nuova Immagine</span>
          </button>
        </div>

        {supabaseConfigured === false && (
          <div
            className="mb-6 rounded-lg border border-amber-600/50 bg-amber-950/40 p-4 text-amber-100"
            role="status"
          >
            <p className="font-semibold">Supabase non configurato in questo ambiente</p>
            <p className="mt-1 text-sm text-amber-200/90">
              In <strong>sviluppo</strong> (senza <code className="rounded bg-black/30 px-1">.env.local</code>)
              puoi comunque usare l&apos;admin: l&apos;elenco galleria si salva in{' '}
              <code className="rounded bg-black/30 px-1">.pilato-dev/app-data.json</code> e
              l&apos;upload scrive sotto <code className="rounded bg-black/30 px-1">public/immagini/caricate/</code>{' '}
              (cartella in gitignore).
            </p>
            <p className="mt-2 text-xs text-amber-200/70">
              In <strong>produzione</strong> (Vercel) imposta{' '}
              <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_SUPABASE_URL</code> e la chiave, e
              lo storage su Supabase, così le immagini non stanno su disco del repo.
            </p>
            {isSitePlaceholder && (
              <p className="mt-3 rounded-md border border-amber-500/30 bg-black/20 p-2 text-sm text-amber-100/95">
                <strong>Griglia sotto:</strong> sono le stesse 8 serate d&apos;esempio che vedi in
                homepage: l&apos;API non ha un elenco salvato, quindi prima sembrava vuota qui.
              </p>
            )}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Aggiungi Nuova Immagine</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-300 mb-2">
                  Seleziona Immagine
                </label>
                <input
                  type="file"
                  id="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-white hover:file:bg-pink-600 file:cursor-pointer"
                  required
                />
                <p className="text-gray-500 text-xs mt-1">
                  L'immagine verrà ridimensionata automaticamente (max 1200x1200px)
                </p>
              </div>

              {/* Preview */}
              {preview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-300 mb-2">Anteprima:</p>
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-600">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="eventTitle" className="mb-2 block text-sm font-medium text-gray-300">
                  Nome serata
                </label>
                <input
                  type="text"
                  id="eventTitle"
                  value={formData.eventTitle}
                  onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white transition-colors focus:outline-none focus:border-pink-500"
                  placeholder="Es. Notte Rosa @ Thebris"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Compare in didascalia sul sito (con la data) con effetto mostra al passaggio del
                  mouse.
                </p>
              </div>
              <div>
                <label htmlFor="eventDate" className="mb-2 block text-sm font-medium text-gray-300">
                  Data serata
                </label>
                <input
                  type="date"
                  id="eventDate"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="max-w-xs rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white transition-colors focus:outline-none focus:border-pink-500"
                />
              </div>
              <div>
                <label htmlFor="alt" className="mb-2 block text-sm font-medium text-gray-300">
                  Testo alternativo (accessibilità)
                </label>
                <input
                  type="text"
                  id="alt"
                  value={formData.alt}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white transition-colors focus:outline-none focus:border-pink-500"
                  placeholder="Lasci vuoto per usare il nome file o la serata"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Se vuoto, in didascalia si usa il nome serata; per lettori di schermo conviene
                  compilarlo.
                </p>
              </div>

              {uploadError && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {uploadError}
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Caricamento...' : 'Carica e Salva'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setFormData({ alt: '', eventTitle: '', eventDate: '' })
                    setSelectedFile(null)
                    setPreview(null)
                    setUploadError(null)
                  }}
                  className="px-6 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors"
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Images Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden group relative"
            >
              <div className="aspect-square relative">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium text-pink-200">
                  {galleryCaptionTitle(image)}
                </p>
                {formatGalleryEventDate(image.eventDate) ? (
                  <p className="mt-0.5 truncate text-xs text-cyan-200/80">
                    {formatGalleryEventDate(image.eventDate)}
                  </p>
                ) : null}
                <p className="mt-1 truncate text-xs text-gray-500" title={image.src}>
                  {image.alt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

