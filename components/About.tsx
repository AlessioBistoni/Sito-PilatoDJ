'use client'

import { motion } from 'framer-motion'
import { Music2, Headphones, Radio, Sparkles } from 'lucide-react'

const features = [
  {
    icon: Music2,
    title: 'Passione per la Musica',
    description: 'La musica è con me sin da quando ero piccolissimo, non è mai stato un gioco, una passione momentanea.',
  },
  {
    icon: Headphones,
    title: 'Esperienza',
    description: 'Ho iniziato presto, ed è per questo che ad oggi di strada ne ho fatta un bel po\'.',
  },
  {
    icon: Radio,
    title: 'Studio di Registrazione',
    description: 'Collaborazione con uno studio di registrazione per garantire la massima qualità.',
  },
  {
    icon: Sparkles,
    title: 'La Nostra Pista da Ballo',
    description: 'Un luogo virtuale ma non troppo, la mia anzi la nostra, pista da ballo.',
  },
]

export default function About() {
  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Chi Sono</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-6" />
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Sono Francesco, Piluz per gli amici e quindi anche per voi. Ho una storia da raccontare:
            la mia e voglio farlo attraverso la musica, quella che più mi piace, quella che per me ha un significato.
          </p>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-effect rounded-2xl p-8 md:p-12 mb-16 max-w-4xl mx-auto"
        >
          <motion.blockquote
            className="text-2xl md:text-3xl font-medium italic text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-pink-500">"</span>
            E coloro che furono visti danzare vennero giudicati pazzi da quelli che non potevano sentire la musica
            <span className="text-pink-500">"</span>
          </motion.blockquote>
          <motion.p
            className="text-right mt-4 text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            — Friedrich Nietzsche
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-effect rounded-xl p-6 hover:border-pink-500/50 transition-all group"
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="mb-4">
                  <Icon
                    className="text-pink-500 group-hover:text-purple-500 transition-colors"
                    size={40}
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-pink-500 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
