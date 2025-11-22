'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, Music, Mic, Radio, Headphones } from 'lucide-react'

const services = [
  {
    icon: Calendar,
    title: 'Eventi Privati',
    description: 'Matrimoni, compleanni, feste private. Creo l\'atmosfera perfetta per ogni occasione speciale.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Users,
    title: 'Serate in Discoteca',
    description: 'Esperienza decennale nel settore delle discoteche. Musica che fa ballare tutta la notte.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Music,
    title: 'Mix Personalizzati',
    description: 'Creo mix unici e personalizzati per ogni evento, studiando il pubblico e l\'atmosfera.',
    color: 'from-blue-500 to-purple-500',
  },
  {
    icon: Mic,
    title: 'MC Services',
    description: 'Non solo musica, ma anche intrattenimento vocale per rendere la serata ancora più coinvolgente.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Radio,
    title: 'Radio & Podcast',
    description: 'Collaborazioni con studi di registrazione per produzioni radiofoniche e podcast musicali.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Headphones,
    title: 'Consulenza Musicale',
    description: 'Consulenza per la scelta della musica perfetta per il tuo evento o progetto.',
    color: 'from-fuchsia-500 to-pink-500',
  },
]

export default function Services() {
  return (
    <section id="services" className="py-20 relative overflow-hidden">
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
            <span className="text-gradient">Servizi</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-6" />
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Offro servizi completi per rendere ogni evento un successo. Dalle serate in discoteca agli eventi privati.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="glass-effect rounded-xl p-8 h-full hover:border-pink-500/50 transition-all relative overflow-hidden">
                  {/* Gradient Background on Hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />
                  
                  <div className="relative z-10">
                    <motion.div
                      className={`mb-6 inline-flex p-4 rounded-xl bg-gradient-to-br ${service.color} bg-opacity-20`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="text-white" size={32} />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-pink-500 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
