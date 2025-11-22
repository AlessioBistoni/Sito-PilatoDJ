'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Plus, Trash2, Image as ImageIcon } from 'lucide-react'

interface GalleryImage {
  id: string
  src: string
  alt: string
}

export default function AdminGallery() {
  const router = useRouter()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    alt: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin_authenticated')
    if (!isAuthenticated) {
      router.push('/admin')
      return
    }
    loadImages()
  }, [router])

  const loadImages = () => {
    const savedImages = localStorage.getItem('gallery_images')
    if (savedImages) {
      setImages(JSON.parse(savedImages))
    } else {
      // Carica immagini di default dalla cartella
      const defaultImages = Array.from({ length: 8 }, (_, i) => ({
        id: `default-${i + 1}`,
        src: `/immagini/serate/${i + 1}.jpg`,
        alt: `Serata ${i + 1}`,
      }))
      setImages(defaultImages)
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

      const newImage: GalleryImage = {
        id: Date.now().toString(),
        src: data.path,
        alt: data.alt,
      }

      const updatedImages = [...images, newImage]
      setImages(updatedImages)
      localStorage.setItem('gallery_images', JSON.stringify(updatedImages))
      
      // Reset form
      setFormData({ alt: '' })
      setSelectedFile(null)
      setPreview(null)
      setShowForm(false)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Errore durante l\'upload')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa immagine?')) {
      return
    }

    const imageToDelete = images.find(img => img.id === id)
    if (!imageToDelete) return

    // Se l'immagine non è una di default, elimina anche il file fisico
    if (!imageToDelete.id.startsWith('default-')) {
      try {
        await fetch(`/api/delete-image?path=${encodeURIComponent(imageToDelete.src)}`, {
          method: 'DELETE',
        })
      } catch (error) {
        console.error('Errore durante l\'eliminazione del file:', error)
      }
    }

    const updatedImages = images.filter(img => img.id !== id)
    setImages(updatedImages)
    localStorage.setItem('gallery_images', JSON.stringify(updatedImages))
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
                <label htmlFor="alt" className="block text-sm font-medium text-gray-300 mb-2">
                  Descrizione
                </label>
                <input
                  type="text"
                  id="alt"
                  value={formData.alt}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                  placeholder="Es: Serata 9"
                />
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
                    setFormData({ alt: '' })
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
                <p className="text-white text-sm font-medium truncate">{image.alt}</p>
                <p className="text-gray-400 text-xs truncate">{image.src}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

