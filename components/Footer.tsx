'use client'

import { motion } from 'framer-motion'
import { Music, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-10 pb-safe sm:py-12">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-5 text-center sm:flex-row sm:flex-wrap sm:justify-between sm:gap-6 sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2"
          >
            <Music className="text-pink-500" size={24} />
            <span className="text-lg font-bold text-gradient sm:text-xl">Francesco Pilato DJ</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-1 text-sm text-gray-400"
          >
            <span>Fatto con</span>
            <Heart className="text-pink-500" size={16} fill="currentColor" />
            <span>per la musica</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-[90vw] text-xs text-gray-400 sm:text-sm"
          >
            © {new Date().getFullYear()} Francesco Pilato. Tutti i diritti riservati.
          </motion.p>
        </div>
      </div>
    </footer>
  )
}
