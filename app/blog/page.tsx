'use client'

import { motion } from 'framer-motion'
import { FileText, Calendar, ArrowLeft, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

interface BlogPost {
  id: string
  title: string
  content: string
  date: string
  published: boolean
  image?: string
  imageCaption?: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set())

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const savedPosts = localStorage.getItem('blog_posts')
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts)
        const publishedPosts = parsedPosts
          .filter((post: BlogPost) => post.published)
          .sort((a: BlogPost, b: BlogPost) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        setPosts(publishedPosts)
      }
    }
  }, [])

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const togglePost = (postId: string) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  return (
    <main className="relative min-h-screen bg-black">
      <Navigation />
      <section className="pt-20 md:pt-24 pb-20 relative">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 md:mb-8"
          >
            <Link
              href="/#blog"
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-pink-500 transition-colors mb-4"
            >
              <ArrowLeft size={16} />
              <span className="text-xs sm:text-sm">Torna alla home</span>
            </Link>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white uppercase tracking-wide">
              Blog
            </h1>
          </motion.div>

          {!mounted ? (
            <div className="text-center py-20">
              <p className="text-gray-400">Caricamento...</p>
            </div>
          ) : filteredPosts.length === 0 && posts.length > 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">Nessun post trovato per la ricerca</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="text-gray-600 mx-auto mb-4" size={64} />
              <p className="text-gray-400 text-xl">Nessun post pubblicato ancora</p>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-4 md:gap-6 lg:gap-8">
              {/* Main Content - Left Column (70%) */}
              <div className="col-span-12 md:col-span-8 lg:col-span-8 space-y-6 md:space-y-8">
                {filteredPosts.map((post, index) => {
                  const isExpanded = expandedPosts.has(post.id)
                  
                  return (
                    <motion.article
                      id={`post-${post.id}`}
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      layout
                      className="glass-effect rounded-lg p-4 md:p-6 cursor-pointer group"
                      onClick={() => togglePost(post.id)}
                      whileHover={{ 
                        scale: 1.02,
                        borderColor: 'rgba(236, 72, 153, 0.5)'
                      }}
                    >
                      {/* Date */}
                      <div className="mb-2">
                        <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider">
                          {new Date(post.date).toLocaleDateString('it-IT', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-pink-500 transition-colors">
                        {post.title}
                      </h2>

                      {/* Image Preview */}
                      {post.image && (
                        <div className="mb-4">
                          <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg overflow-hidden">
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, 70vw"
                            />
                          </div>
                          {isExpanded && post.imageCaption && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-gray-400 text-xs sm:text-sm mt-2 italic"
                            >
                              {post.imageCaption}
                            </motion.p>
                          )}
                        </div>
                      )}

                      {/* Content - Always show full content, just expand/collapse */}
                      <div className="overflow-hidden">
                        <motion.div
                          animate={{
                            maxHeight: isExpanded ? '5000px' : '120px',
                          }}
                          transition={{
                            duration: 0.6,
                            ease: [0.4, 0, 0.2, 1]
                          }}
                          className="overflow-hidden"
                        >
                          <div className="text-gray-300 leading-relaxed text-sm sm:text-base md:text-lg space-y-4 break-words">
                            {post.content.split('\n\n').map((paragraph, i) => {
                              const trimmed = paragraph.trim()
                              if (!trimmed) return null
                              
                              if (trimmed.length < 100 && /^[A-Z\s?]+$/.test(trimmed)) {
                                return (
                                  <h3 key={i} className="text-lg sm:text-xl md:text-2xl font-bold text-white mt-6 mb-3">
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
                        
                        {/* Button */}
                        <div className="flex items-center space-x-2 mt-4 text-pink-500 text-sm font-medium">
                          {!isExpanded ? (
                            <>
                              <span>Leggi di più</span>
                              <motion.div
                                animate={{ y: [0, 3, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
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
                    </motion.article>
                  )
                })}
              </div>

              {/* Sidebar - Right Column (30%) */}
              <div className="col-span-12 md:col-span-4 lg:col-span-4">
                <div className="sticky top-20 md:top-24 space-y-4 md:space-y-6">
                  {/* Search */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-effect rounded-lg p-3 md:p-4"
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cerca..."
                        className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors text-xs sm:text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button 
                        className="p-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Search size={16} />
                      </button>
                    </div>
                  </motion.div>

                  {/* Recent Posts */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-effect rounded-lg p-4 md:p-6"
                  >
                    <h3 className="text-base sm:text-lg font-bold text-white mb-4 uppercase tracking-wide">
                      Articoli Recenti
                    </h3>
                    <div className="space-y-3 md:space-y-4">
                      {posts.slice(0, 5).map((post, idx) => (
                        <div key={post.id}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              togglePost(post.id)
                              setTimeout(() => {
                                const element = document.getElementById(`post-${post.id}`)
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                }
                              }, 100)
                            }}
                            className="block w-full text-left group"
                          >
                            <p className="text-gray-300 group-hover:text-pink-500 transition-colors text-xs sm:text-sm leading-snug">
                              {post.title}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              {new Date(post.date).toLocaleDateString('it-IT', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </button>
                          {idx < Math.min(posts.length, 5) - 1 && (
                            <div className="mt-3 md:mt-4 border-t border-gray-700" />
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
