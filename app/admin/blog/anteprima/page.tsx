'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Eye, Plus, Trash2 } from 'lucide-react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import BlogPublicView from '@/components/BlogPublicView'
import type { BlogPost } from '@/lib/blog-types'

export default function AdminBlogAnteprimaPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [rawPosts, setRawPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [includeDrafts, setIncludeDrafts] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/data/blog', { cache: 'no-store' })
      const data = await res.json()
      const list: BlogPost[] = data.posts || []
      const sorted = [...list].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      setRawPosts(sorted)
    } catch {
      setRawPosts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (includeDrafts) {
      setPosts(rawPosts)
    } else {
      setPosts(rawPosts.filter((p) => p.published))
    }
  }, [includeDrafts, rawPosts])

  const goToEdit = (id: string) => {
    router.push(`/admin/blog?edit=${encodeURIComponent(id)}`)
  }

  const goToNew = () => {
    router.push('/admin/blog?new=1')
  }

  const togglePublish = async (id: string) => {
    const updated = rawPosts.map((p) =>
      p.id === id ? { ...p, published: !p.published } : p
    )
    try {
      const res = await fetch('/api/data/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: updated }),
      })
      if (res.ok) {
        setRawPosts(updated)
      } else {
        alert('Impossibile aggiornare la pubblicazione')
      }
    } catch {
      alert('Errore di rete')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Eliminare definitivamente questo post?')) return
    const post = rawPosts.find((p) => p.id === id)
    if (!post) return
    if (post.image && post.image.startsWith('http')) {
      try {
        await fetch(`/api/delete-image?path=${encodeURIComponent(post.image)}`, {
          method: 'DELETE',
        })
      } catch {
        // ignora
      }
    }
    const updated = rawPosts.filter((p) => p.id !== id)
    try {
      const res = await fetch('/api/data/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: updated }),
      })
      if (res.ok) {
        setRawPosts(updated)
      } else {
        alert("Impossibile eliminare dall'elenco")
      }
    } catch {
      alert('Errore di rete')
    }
  }

  return (
    <main className="relative min-h-dvh min-w-0 bg-black pb-safe">
      <div className="sticky top-0 z-[60] border-b border-pink-500/25 bg-zinc-950/95 px-3 py-3 backdrop-blur-md sm:px-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/admin/blog"
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm text-white/90 transition hover:border-pink-500/40"
            >
              <ArrowLeft className="h-4 w-4" />
              Gestione blog
            </Link>
            <button
              type="button"
              onClick={goToNew}
              className="inline-flex items-center gap-2 rounded-lg border border-pink-500/40 bg-pink-500/15 px-3 py-2 text-sm text-pink-100 transition hover:bg-pink-500/25"
            >
              <Plus className="h-4 w-4" />
              Nuovo post
            </button>
            <span className="hidden text-white/30 sm:inline">|</span>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Eye className="h-4 w-4 text-pink-400" aria-hidden />
              <span>Anteprima come sul sito</span>
            </div>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-600"
              checked={includeDrafts}
              onChange={(e) => setIncludeDrafts(e.target.checked)}
            />
            Mostra anche le bozze
          </label>
        </div>
        <p className="mx-auto mt-2 max-w-7xl text-xs text-amber-200/80">
          Con le bozze disattivate vedi solo i post pubblicati, come un visitatore. Usa
          <strong> Modifica</strong> per aprire il form completo in gestione blog.
        </p>
      </div>
      <Navigation />
      <BlogPublicView
        posts={posts}
        loading={loading}
        backLink={{ href: '/admin/blog', label: 'Torna a gestione blog' }}
        pageTitle="Blog"
        emptyMessage="Nessun post in questa vista. Attiva &quot;Mostra anche le bozze&quot; o pubblica un post dalla gestione."
        showDraftBadge={includeDrafts}
        adminPostActions={(post) => (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => goToEdit(post.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-pink-500/40 bg-pink-500/10 px-3 py-2 text-sm text-pink-200 transition hover:bg-pink-500/20"
            >
              <Edit className="h-4 w-4" />
              Modifica
            </button>
            <button
              type="button"
              onClick={() => void togglePublish(post.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition ${
                post.published
                  ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-200 hover:bg-yellow-500/20'
                  : 'border-green-500/40 bg-green-500/10 text-green-200 hover:bg-green-500/20'
              }`}
            >
              {post.published ? 'Nascondi' : 'Pubblica'}
            </button>
            <button
              type="button"
              onClick={() => void handleDelete(post.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200 transition hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4" />
              Elimina
            </button>
          </div>
        )}
      />
      <Footer />
    </main>
  )
}
