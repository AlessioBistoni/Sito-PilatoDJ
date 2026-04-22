'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import BlogPublicView from '@/components/BlogPublicView'
import type { BlogPost } from '@/lib/blog-types'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const response = await fetch('/api/data/blog', { cache: 'no-store' })
        const data = await response.json()
        const parsedPosts: BlogPost[] = data.posts || []
        const publishedPosts = parsedPosts
          .filter((post: BlogPost) => post.published)
          .sort(
            (a: BlogPost, b: BlogPost) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        if (!cancelled) setPosts(publishedPosts)
      } catch {
        if (!cancelled) setPosts([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="relative min-h-dvh min-w-0 bg-black pb-safe">
      <Navigation />
      <BlogPublicView
        posts={posts}
        loading={loading}
        backLink={{ href: '/#blog', label: 'Torna alla home' }}
      />
      <Footer />
    </main>
  )
}
