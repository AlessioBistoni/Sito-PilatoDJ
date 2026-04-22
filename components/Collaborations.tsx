'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import BlogImage from '@/components/BlogImage'
import type { CollaborationPartner } from '@/lib/collaborations'

export default function Collaborations() {
  const [partners, setPartners] = useState<CollaborationPartner[] | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/data/collaborations', { cache: 'no-store' })
        const data = await res.json()
        const list = Array.isArray(data.partners) ? data.partners : []
        if (!cancelled) setPartners(list)
      } catch {
        if (!cancelled) setPartners([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const list = partners ?? []

  return (
    <section id="collaborazioni" className="section-y relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />

      <div className="container relative z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-10 text-center sm:mb-12"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="text-gradient">Collaborazioni</span>
          </h2>
          <div className="mx-auto mb-6 h-1 w-24 bg-gradient-to-r from-pink-500 to-purple-500" />
          <p className="mx-auto max-w-3xl px-1 text-base leading-relaxed text-gray-300 sm:text-lg md:text-xl">
            Partnership costruite con realtà del nightlife e dell&apos;entertainment, con un
            approccio professionale orientato alla qualità musicale e all&apos;esperienza del pubblico.
          </p>
        </motion.div>

        {list.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-10 sm:gap-12 md:gap-14"
          >
            {list.map((p, i) => (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.35) }}
                className="flex w-36 flex-col items-center sm:w-40"
              >
                {p.websiteUrl ? (
                  <a
                    href={p.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full flex-col items-center text-inherit no-underline outline-none ring-pink-500/50 focus-visible:ring-2"
                  >
                    <div className="relative mb-3 h-20 w-full max-w-[10rem] rounded-lg border border-white/10 bg-white/5 p-3 transition-colors hover:border-pink-500/30 sm:h-24">
                      <BlogImage
                        src={p.imageUrl}
                        alt={p.name}
                        fill
                        objectFit="contain"
                        className="p-1"
                        sizes="(max-width: 768px) 144px, 160px"
                      />
                    </div>
                    <span className="text-center text-xs text-gray-400 underline-offset-2 hover:underline sm:text-sm">
                      {p.name}
                    </span>
                  </a>
                ) : (
                  <>
                    <div className="relative mb-3 h-20 w-full max-w-[10rem] rounded-lg border border-white/10 bg-white/5 p-3 sm:h-24">
                      <BlogImage
                        src={p.imageUrl}
                        alt={p.name}
                        fill
                        objectFit="contain"
                        className="p-1"
                        sizes="(max-width: 768px) 144px, 160px"
                      />
                    </div>
                    <span className="text-center text-xs text-gray-400 sm:text-sm">{p.name}</span>
                  </>
                )}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  )
}
