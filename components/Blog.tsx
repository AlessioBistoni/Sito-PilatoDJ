'use client'

import { motion } from 'framer-motion'
import { FileText, Calendar, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
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

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const savedPosts = localStorage.getItem('blog_posts')
      if (savedPosts) {
        const parsedPosts = JSON.parse(savedPosts)
        // Mostra solo i post pubblicati
        const publishedPosts = parsedPosts
          .filter((post: BlogPost) => post.published)
          .slice(0, 3) // Mostra solo gli ultimi 3 come anteprima
        setPosts(publishedPosts)
      }
    }
  }, [])

  if (!mounted || posts.length === 0) return null

  return (
    <section id="blog" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-pink-900/10 to-black" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Blog</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-6" />
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Aggiornamenti, pensieri e novità dal mondo della musica.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition-colors"
          >
            <span>Vedi tutti i post</span>
            <ArrowRight size={20} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {posts.map((post, index) => (
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
                className="glass-effect rounded-xl overflow-hidden hover:border-pink-500/50 transition-all group h-full flex flex-col cursor-pointer"
              >
                {post.image && (
                  <div className="relative w-full h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg">
                      <FileText className="text-white" size={20} />
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <Calendar size={14} />
                      <span>
                        {new Date(post.date).toLocaleDateString('it-IT', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-500 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 flex-1 line-clamp-4">
                    {post.content}
                  </p>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

