'use client'

import { motion } from 'framer-motion'

const BIO_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`

export default function About() {
  return (
    <section id="biografia" className="section-y relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="text-gradient">Biografia</span>
          </h2>
          <div className="mx-auto mb-8 h-1 w-24 bg-gradient-to-r from-pink-500 to-purple-500" />
          <p className="text-left text-base leading-relaxed text-gray-300 sm:text-lg md:text-xl">
            {BIO_TEXT}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
