'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Youtube, Music } from 'lucide-react'
import { useState } from 'react'

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Music, href: '#', label: 'Spotify' },
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulazione invio form
    setTimeout(() => {
      setIsSubmitting(false)
      alert('Messaggio inviato con successo! Ti contatterò presto.')
      setFormData({ name: '', email: '', phone: '', message: '' })
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
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
            <span className="text-gradient">Contatti</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-6" />
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Hai un evento in programma? Contattami per rendere la tua serata indimenticabile.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gradient">Informazioni</h3>
              <div className="space-y-6">
                <motion.a
                  href="mailto:info@francescopilatodj.com"
                  className="flex items-center space-x-4 glass-effect p-4 rounded-xl hover:border-pink-500/50 transition-all group"
                  whileHover={{ x: 10 }}
                >
                  <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg">
                    <Mail className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white group-hover:text-pink-500 transition-colors">
                      info@francescopilatodj.com
                    </p>
                  </div>
                </motion.a>

                <motion.a
                  href="tel:+39"
                  className="flex items-center space-x-4 glass-effect p-4 rounded-xl hover:border-pink-500/50 transition-all group"
                  whileHover={{ x: 10 }}
                >
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                    <Phone className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Telefono</p>
                    <p className="text-white group-hover:text-pink-500 transition-colors">
                      +39 XXX XXX XXXX
                    </p>
                  </div>
                </motion.a>

                <div className="flex items-center space-x-4 glass-effect p-4 rounded-xl">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Zona</p>
                    <p className="text-white">Italia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gradient">Seguimi</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 glass-effect rounded-xl hover:border-pink-500/50 transition-all group"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon className="text-white group-hover:text-pink-500 transition-colors" size={24} />
                    </motion.a>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onSubmit={handleSubmit}
            className="glass-effect p-8 rounded-2xl space-y-6"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                placeholder="Il tuo nome"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                placeholder="la.tua.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Telefono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                placeholder="+39 XXX XXX XXXX"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Messaggio
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg focus:outline-none focus:border-pink-500 transition-colors resize-none"
                placeholder="Raccontami del tuo evento..."
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full font-semibold text-white flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{isSubmitting ? 'Invio...' : 'Invia Messaggio'}</span>
              <Send size={20} />
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
