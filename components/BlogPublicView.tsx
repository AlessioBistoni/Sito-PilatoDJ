'use client'

import { motion } from 'framer-motion'
import { FileText, ArrowLeft, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import type { BlogPost } from '@/lib/blog-types'
import { resolveBlogImageSrc } from '@/lib/blog-image-url'
import BlogImage from '@/components/BlogImage'

export type BlogPublicViewProps = {
  posts: BlogPost[]
  loading?: boolean
  backLink: { href: string; label: string }
  pageTitle?: string
  /** Messaggio se non ci sono post (lista vuota) */
  emptyMessage?: string
  /** In anteprima admin: mostra etichetta Bozza */
  showDraftBadge?: boolean
  /** Barra azioni sotto ogni articolo (admin) */
  adminPostActions?: (post: BlogPost) => ReactNode
}

export default function BlogPublicView({
  posts,
  loading = false,
  backLink,
  pageTitle = 'Blog',
  emptyMessage = 'Nessun post pubblicato ancora',
  showDraftBadge = false,
  adminPostActions,
}: BlogPublicViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set())

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const togglePost = (postId: string) => {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const goToPostFromRecent = (post: BlogPost) => {
    const inFiltered = filteredPosts.some((p) => p.id === post.id)
    if (!inFiltered) {
      setSearchQuery('')
    }
    const openAndScroll = () => {
      setExpandedPosts((prev) => {
        const next = new Set(prev)
        next.add(post.id)
        return next
      })
      setTimeout(() => {
        document.getElementById(`post-${post.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
    if (!inFiltered) {
      setTimeout(openAndScroll, 120)
    } else {
      openAndScroll()
    }
  }

  const searchBarInner = (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Cerca..."
        className="flex-1 rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-2 text-xs text-white placeholder-gray-500 transition-colors focus:border-pink-500 focus:outline-none sm:text-sm"
        onClick={(e) => e.stopPropagation()}
        aria-label="Cerca nel blog"
      />
      <button
        type="button"
        className="rounded-lg border border-gray-700 bg-gray-800/50 p-2 text-white transition-colors hover:bg-gray-700"
        onClick={(e) => e.stopPropagation()}
        aria-label="Cerca"
      >
        <Search size={16} />
      </button>
    </div>
  )

  const recentPostsBlock = () => (
    <div>
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-white sm:mb-4 sm:text-base md:text-lg">
        Articoli Recenti
      </h3>
      <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
        {posts.slice(0, 5).map((post, idx) => (
          <div key={post.id}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goToPostFromRecent(post)
              }}
              className="group block w-full text-left"
            >
              <p className="text-xs leading-snug text-gray-300 transition-colors group-hover:text-pink-500 sm:text-sm">
                {post.title}
                {showDraftBadge && !post.published && (
                  <span className="ml-1 text-yellow-500">(bozza)</span>
                )}
              </p>
              <p className="mt-0.5 text-xs text-gray-500 sm:mt-1">
                {new Date(post.date).toLocaleDateString('it-IT', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </button>
            {idx < Math.min(posts.length, 5) - 1 && (
              <div className="mt-2.5 border-t border-gray-700 sm:mt-3 md:mt-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <section className="relative pb-12 pt-[calc(3.5rem+env(safe-area-inset-top,0px)+1rem)] sm:pb-16 md:pb-20 md:pt-24">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 md:mb-8"
        >
          <Link
            href={backLink.href}
            className="inline-flex items-center space-x-2 text-gray-400 transition-colors hover:text-pink-500 mb-4"
          >
            <ArrowLeft size={16} />
            <span className="text-xs sm:text-sm">{backLink.label}</span>
          </Link>
          <h1 className="text-xl font-bold uppercase tracking-wide text-white sm:text-2xl md:text-3xl">
            {pageTitle}
          </h1>
        </motion.div>

        {!loading && posts.length > 0 && (
          <div className="mb-6 space-y-4 md:hidden">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="glass-effect rounded-lg p-3">{searchBarInner}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              <div className="glass-effect rounded-lg p-3 sm:p-4">
                {recentPostsBlock()}
              </div>
            </motion.div>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <p className="text-gray-400">Caricamento...</p>
          </div>
        ) : filteredPosts.length === 0 && posts.length > 0 ? (
          <div className="py-12 text-center md:py-20">
            <p className="text-xl text-gray-400">Nessun post trovato per la ricerca</p>
            <div className="mx-auto mt-8 hidden max-w-md text-left md:block">
              <div className="glass-effect rounded-lg p-4 md:p-6">{recentPostsBlock()}</div>
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-20 text-center">
            <FileText className="mx-auto mb-4 text-gray-600" size={64} />
            <p className="text-xl text-gray-400">{emptyMessage}</p>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-4 md:gap-6 lg:gap-8">
            <div className="col-span-12 space-y-6 md:col-span-8 md:space-y-8 lg:col-span-8">
              {filteredPosts.map((post, index) => {
                const isExpanded = expandedPosts.has(post.id)
                const imageSrc = resolveBlogImageSrc(post.image)

                return (
                  <motion.article
                    id={`post-${post.id}`}
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    layout
                    className="glass-effect group cursor-pointer rounded-lg p-4 md:p-6"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('[data-admin-blog-actions]')) {
                        return
                      }
                      togglePost(post.id)
                    }}
                    whileHover={{
                      scale: 1.02,
                      borderColor: 'rgba(236, 72, 153, 0.5)',
                    }}
                  >
                    <div>
                      <div className="mb-2">
                        <p className="text-xs uppercase tracking-wider text-gray-400 sm:text-sm">
                          {new Date(post.date).toLocaleDateString('it-IT', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>

                      {imageSrc && !isExpanded && (
                        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-5">
                          <div className="relative mx-auto w-full max-w-sm shrink-0 overflow-hidden rounded-lg border border-white/5 bg-zinc-950/70 sm:mx-0 sm:max-w-none sm:w-56 md:w-64">
                            <div className="relative aspect-[4/3] w-full">
                              <BlogImage
                                src={post.image}
                                alt={post.title}
                                fill
                                objectFit="contain"
                                className="transition-transform duration-300 group-hover:scale-[1.01]"
                                sizes="(max-width: 640px) 100vw, 35vw"
                              />
                            </div>
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                              <h2 className="text-xl font-bold leading-tight text-white transition-colors group-hover:text-pink-500 sm:text-2xl md:text-3xl">
                                {post.title}
                              </h2>
                              {showDraftBadge && !post.published && (
                                <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">
                                  Bozza
                                </span>
                              )}
                            </div>
                            <div className="min-h-0 flex-1 overflow-hidden">
                              <div className="max-h-[120px] overflow-hidden">
                                <div className="space-y-3 break-words text-sm leading-relaxed text-gray-300 sm:text-base">
                                  {post.content.split('\n\n').map((paragraph, i) => {
                                    const trimmed = paragraph.trim()
                                    if (!trimmed) return null
                                    if (trimmed.length < 100 && /^[A-Z\s?]+$/.test(trimmed)) {
                                      return (
                                        <h3 key={i} className="text-base font-bold text-white sm:text-lg">
                                          {trimmed}
                                        </h3>
                                      )
                                    }
                                    return (
                                      <p key={i} className="mb-2 last:mb-0">
                                        {trimmed}
                                      </p>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center space-x-2 text-sm font-medium text-pink-500">
                              <span>Leggi di più</span>
                              <motion.div
                                animate={{ y: [0, 3, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                              >
                                <ChevronDown size={16} />
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      )}

                      {imageSrc && isExpanded && (
                        <>
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-bold leading-tight text-white sm:text-2xl md:text-3xl lg:text-4xl">
                              {post.title}
                            </h2>
                            {showDraftBadge && !post.published && (
                              <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">
                                Bozza
                              </span>
                            )}
                          </div>
                          <div className="relative mb-2 w-full overflow-hidden rounded-xl border border-white/5 bg-zinc-950/80">
                            <div className="relative mx-auto h-[min(70vh,680px)] min-h-[240px] w-full max-w-5xl">
                              <BlogImage
                                src={post.image}
                                alt={post.title}
                                fill
                                objectFit="contain"
                                sizes="(max-width: 768px) 100vw, min(896px, 80vw)"
                                priority={index < 2}
                              />
                            </div>
                            {post.imageCaption && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-3 text-sm italic text-gray-400"
                              >
                                {post.imageCaption}
                              </motion.p>
                            )}
                          </div>
                        </>
                      )}

                      {!imageSrc && (
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-bold leading-tight text-white transition-colors group-hover:text-pink-500 sm:text-2xl md:text-3xl lg:text-4xl">
                            {post.title}
                          </h2>
                          {showDraftBadge && !post.published && (
                            <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">
                              Bozza
                            </span>
                          )}
                        </div>
                      )}

                      {(!imageSrc || isExpanded) && (
                        <div
                          className={`overflow-hidden ${imageSrc && isExpanded ? 'mt-6 border-t border-white/10 pt-6' : ''}`}
                        >
                          <motion.div
                            animate={{
                              maxHeight: isExpanded ? '5000px' : '120px',
                            }}
                            transition={{
                              duration: 0.6,
                              ease: [0.4, 0, 0.2, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-4 break-words text-sm leading-relaxed text-gray-300 sm:text-base md:text-lg">
                              {post.content.split('\n\n').map((paragraph, i) => {
                                const trimmed = paragraph.trim()
                                if (!trimmed) return null

                                if (trimmed.length < 100 && /^[A-Z\s?]+$/.test(trimmed)) {
                                  return (
                                    <h3
                                      key={i}
                                      className="mb-3 mt-6 text-lg font-bold text-white sm:text-xl md:text-2xl"
                                    >
                                      {trimmed}
                                    </h3>
                                  )
                                }

                                return (
                                  <p key={i} className="mb-3">
                                    {trimmed.split('\n').map((line, j) => (
                                      <span key={j}>
                                        {line}
                                        {j < trimmed.split('\n').length - 1 && <br />}
                                      </span>
                                    ))}
                                  </p>
                                )
                              })}
                            </div>
                          </motion.div>

                          <div className="mt-4 flex items-center space-x-2 text-sm font-medium text-pink-500">
                            {!isExpanded ? (
                              <>
                                <span>Leggi di più</span>
                                <motion.div
                                  animate={{ y: [0, 3, 0] }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                  }}
                                >
                                  <ChevronDown size={16} />
                                </motion.div>
                              </>
                            ) : (
                              <>
                                <span>Mostra meno</span>
                                <ChevronUp size={16} />
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {adminPostActions && (
                      <div
                        data-admin-blog-actions
                        className="mt-4 border-t border-white/10 pt-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {adminPostActions(post)}
                      </div>
                    )}
                  </motion.article>
                )
              })}
            </div>

            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <div className="sticky top-20 space-y-4 md:top-24 md:space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="hidden glass-effect rounded-lg p-3 md:block md:p-4"
                >
                  {searchBarInner}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="hidden glass-effect rounded-lg p-4 md:block md:p-6"
                >
                  {recentPostsBlock()}
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
