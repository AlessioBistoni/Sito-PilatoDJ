'use client'

import { motion } from 'framer-motion'
import { Music, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative py-12 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center space-x-2"
          >
            <Music className="text-pink-500" size={24} />
            <span className="text-xl font-bold text-gradient">Francesco Pilato DJ</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-sm flex items-center space-x-1"
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
            className="text-gray-400 text-sm"
          >
            © {new Date().getFullYear()} Francesco Pilato. Tutti i diritti riservati.
          </motion.p>
        </div>
      </div>
    </footer>
  )
}
