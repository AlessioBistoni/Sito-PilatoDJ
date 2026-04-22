'use client'

import { motion } from 'framer-motion'
import { FileText, Calendar, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { resolveBlogImageSrc } from '@/lib/blog-image-url'
import BlogImage from '@/components/BlogImage'

interface BlogPost {
  id: string
  title: string
  content: string
  date: string
  published: boolean
  image?: string
  imageCaption?: string
}

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const response = await fetch('/api/data/blog')
        const data = await response.json()
        const parsedPosts = data.posts || []
        const publishedPosts = parsedPosts
          .filter((post: BlogPost) => post.published)
          .slice(0, 3)
        if (!cancelled) setPosts(publishedPosts)
      } catch {
        if (!cancelled) setPosts([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section id="blog" className="section-y relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-pink-900/10 to-black" />

      <div className="container relative z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Blog</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-6" />
          <p className="mx-auto mb-6 max-w-3xl px-1 text-base leading-relaxed text-gray-300 sm:mb-8 sm:text-lg md:text-xl">
            Aggiornamenti, pensieri e novità dal mondo della musica.
          </p>
          <Link
            href="/blog"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:from-pink-600 hover:to-purple-600 sm:text-base"
          >
            <span>Vedi tutti i post</span>
            <ArrowRight size={20} />
          </Link>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
          {posts.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <FileText className="text-gray-600 mx-auto mb-4" size={48} />
              <p className="text-gray-400 text-lg">Nessun articolo pubblicato al momento.</p>
            </div>
          ) : null}
          {posts.map((post, index) => {
            const imageSrc = resolveBlogImageSrc(post.image)
            return (
            <Link
              key={post.id}
              href="/blog"
              className="block"
            >
              <motion.article
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group flex h-full w-full cursor-pointer items-center gap-3 rounded-xl border border-white/5 p-3 transition-all hover:border-pink-500/50 sm:gap-4 sm:p-4 ${
                  imageSrc
                    ? 'glass-effect flex-row'
                    : 'glass-effect flex-col justify-center p-4 pt-6 sm:p-6'
                } `}
              >
                {imageSrc && (
                  <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-lg border border-white/5 bg-zinc-950/80 sm:h-24 sm:w-24">
                    <BlogImage
                      src={post.image}
                      alt={post.title}
                      fill
                      objectFit="contain"
                      className="transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="96px"
                    />
                  </div>
                )}
                <div
                  className={`flex min-w-0 flex-1 flex-col justify-center ${
                    !imageSrc ? 'w-full' : ''
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2 sm:mb-2.5 sm:gap-3">
                    <div className="shrink-0 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 p-1.5 sm:p-2">
                      <FileText className="text-white" size={20} />
                    </div>
                    <div className="flex min-w-0 items-center gap-1.5 text-xs text-gray-400 sm:text-sm">
                      <Calendar size={13} className="shrink-0 sm:w-3.5 sm:h-3.5" />
                      <span className="truncate">
                        {new Date(post.date).toLocaleDateString('it-IT', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                  <h3 className="mb-1.5 line-clamp-2 break-words text-base font-bold text-white transition-colors group-hover:text-pink-500 sm:mb-2 sm:text-lg">
                    {post.title}
                  </h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-gray-300 sm:line-clamp-4 sm:text-base">
                    {post.content}
                  </p>
                </div>
              </motion.article>
            </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

