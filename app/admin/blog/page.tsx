'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, FileText, Edit, Image as ImageIcon, X } from 'lucide-react'
import Image from 'next/image'

interface BlogPost {
  id: string
  title: string
  content: string
  date: string
  published: boolean
  image?: string
  imageCaption?: string
}

export default function AdminBlog() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published: true,
    image: '',
    imageCaption: '',
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
    loadPosts()
  }, [router])

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/data/blog')
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Errore nel caricamento dei post:', error)
      setPosts([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let updatedPosts: BlogPost[]
    
    if (editingPost) {
      // Modifica post esistente
      updatedPosts = posts.map(post =>
        post.id === editingPost.id
          ? { ...formData, id: editingPost.id, date: editingPost.date }
          : post
      )
    } else {
      // Nuovo post
      const newPost: BlogPost = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString(),
      }
      updatedPosts = [newPost, ...posts]
    }
    
    try {
      const response = await fetch('/api/data/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: updatedPosts }),
      })
      
      if (response.ok) {
        setPosts(updatedPosts)
        setFormData({ title: '', content: '', published: true, image: '', imageCaption: '' })
        setSelectedFile(null)
        setPreview(null)
        setShowForm(false)
        setEditingPost(null)
      } else {
        alert('Errore nel salvataggio del post')
      }
    } catch (error) {
      console.error('Errore nel salvataggio:', error)
      alert('Errore nel salvataggio del post')
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

  const handleImageUpload = async () => {
    if (!selectedFile) {
      setUploadError('Seleziona un\'immagine')
      return
    }

    setUploading(true)
    setUploadError(null)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', selectedFile)

      const response = await fetch('/api/upload-blog-image', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante l\'upload')
      }

      setFormData({ ...formData, image: data.path })
      setSelectedFile(null)
      setPreview(null)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Errore durante l\'upload')
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: '', imageCaption: '' })
    setSelectedFile(null)
    setPreview(null)
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      published: post.published,
      image: post.image || '',
      imageCaption: post.imageCaption || '',
    })
    if (post.image) {
      // Se l'immagine è già caricata, mostra il percorso completo
      setPreview(post.image.startsWith('/') ? post.image : `/${post.image}`)
    }
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo post?')) {
      return
    }

    const postToDelete = posts.find(post => post.id === id)
    if (!postToDelete) return

    // Se il post ha un'immagine, elimina anche il file da Vercel Blob
    if (postToDelete.image && postToDelete.image.startsWith('http')) {
      try {
        await fetch(`/api/delete-blog-image?path=${encodeURIComponent(postToDelete.image)}`, {
          method: 'DELETE',
        })
      } catch (error) {
        console.error('Errore durante l\'eliminazione dell\'immagine:', error)
      }
    }

    const updatedPosts = posts.filter(post => post.id !== id)
    
    try {
      const response = await fetch('/api/data/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: updatedPosts }),
      })
      
      if (response.ok) {
        setPosts(updatedPosts)
      }
    } catch (error) {
      console.error('Errore nell\'eliminazione:', error)
      alert('Errore nell\'eliminazione del post')
    }
  }

  const togglePublish = async (id: string) => {
    const updatedPosts = posts.map(post =>
      post.id === id ? { ...post, published: !post.published } : post
    )
    
    try {
      const response = await fetch('/api/data/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: updatedPosts }),
      })
      
      if (response.ok) {
        setPosts(updatedPosts)
      }
    } catch (error) {
      console.error('Errore nell\'aggiornamento:', error)
      alert('Errore nell\'aggiornamento del post')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto w-full overflow-hidden">
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
              <h1 className="text-3xl font-bold text-white">Gestione Blog</h1>
              <p className="text-gray-400">Pubblica aggiornamenti e pensieri</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingPost(null)
              setFormData({ title: '', content: '', published: true, image: '', imageCaption: '' })
              setSelectedFile(null)
              setPreview(null)
              setUploadError(null)
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white hover:from-pink-600 hover:to-purple-600 transition-colors"
          >
            <Plus size={20} />
            <span>Nuovo Post</span>
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6 overflow-hidden">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingPost ? 'Modifica Post' : 'Nuovo Post'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                  Titolo
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors break-words"
                  style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                  placeholder="Titolo del post"
                  required
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
                  Immagine Principale (Opzionale)
                </label>
                {formData.image ? (
                  <div className="mb-4">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-600 mb-2">
                      <Image
                        src={formData.image.startsWith('/') ? formData.image : `/${formData.image}`}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={formData.imageCaption}
                        onChange={(e) => setFormData({ ...formData, imageCaption: e.target.value })}
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors"
                        placeholder="Didascalia immagine (opzionale)"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="p-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-500 file:text-white hover:file:bg-pink-600 file:cursor-pointer"
                    />
                    {preview && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-600">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {selectedFile && (
                      <button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={uploading}
                        className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading ? 'Caricamento...' : 'Carica Immagine'}
                      </button>
                    )}
                    {uploadError && (
                      <p className="text-red-400 text-sm">{uploadError}</p>
                    )}
                    <p className="text-gray-500 text-xs">
                      L'immagine verrà ridimensionata automaticamente (max 1400px di larghezza)
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                  Contenuto
                </label>
                  <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-pink-500 transition-colors resize-none break-words"
                  style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                  placeholder="Scrivi il contenuto del post..."
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 text-pink-500 bg-gray-700 border-gray-600 rounded focus:ring-pink-500"
                />
                <label htmlFor="published" className="text-sm text-gray-300">
                  Pubblica subito
                </label>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-colors"
                >
                  {editingPost ? 'Aggiorna' : 'Pubblica'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingPost(null)
                    setFormData({ title: '', content: '', published: true, image: '', imageCaption: '' })
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

        {/* Posts List */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
              <FileText className="text-gray-600 mx-auto mb-4" size={48} />
              <p className="text-gray-400">Nessun post pubblicato</p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className={`bg-gray-800 border rounded-lg p-6 ${
                  post.published ? 'border-gray-700' : 'border-gray-600 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-bold text-white break-words">{post.title}</h3>
                      {!post.published && (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                          Bozza
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      {new Date(post.date).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {post.image && (
                      <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden border border-gray-600 mb-3">
                        <Image
                          src={post.image.startsWith('/') ? post.image : `/${post.image}`}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="text-gray-300 whitespace-pre-wrap break-words w-full" style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                      {post.content}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors"
                  >
                    <Edit size={16} />
                    <span>Modifica</span>
                  </button>
                  <button
                    onClick={() => togglePublish(post.id)}
                    className={`px-4 py-2 rounded-lg text-white transition-colors ${
                      post.published
                        ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/30'
                        : 'bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30'
                    }`}
                  >
                    {post.published ? 'Nascondi' : 'Pubblica'}
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

