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
    <section id="contact" className="section-y relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-pink-900/10 to-black" />

      <div className="container relative z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Contatti</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mb-6" />
          <p className="mx-auto max-w-3xl px-1 text-base leading-relaxed text-gray-300 sm:text-lg md:text-xl">
            Hai un evento in programma? Contattami per rendere la tua serata indimenticabile.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8"
          >
            <div>
              <h3 className="mb-4 text-xl font-bold text-gradient sm:mb-6 sm:text-2xl">Informazioni</h3>
              <div className="space-y-4 sm:space-y-6">
                <motion.a
                  href="mailto:info@francescopilatodj.com"
                  className="group flex min-h-[52px] items-center gap-4 rounded-xl glass-effect p-4 transition-all hover:border-pink-500/50 active:bg-white/5"
                  whileHover={{ x: 6 }}
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
                  className="group flex min-h-[52px] items-center gap-4 rounded-xl glass-effect p-4 transition-all hover:border-pink-500/50 active:bg-white/5"
                  whileHover={{ x: 6 }}
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

                <div className="flex min-h-[52px] items-center gap-4 rounded-xl glass-effect p-4">
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
              <h3 className="mb-4 text-xl font-bold text-gradient sm:mb-6 sm:text-2xl">Seguimi</h3>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tap-target rounded-xl glass-effect p-3 transition-all hover:border-pink-500/50 group sm:p-4"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
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
            className="space-y-5 rounded-2xl glass-effect p-4 sm:space-y-6 sm:p-6 md:p-8"
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
                className="min-h-[48px] w-full rounded-lg border border-white/20 bg-black/50 px-4 py-3 text-base text-white placeholder:text-gray-500 focus:border-pink-500 focus:outline-none"
                placeholder="Il tuo nome"
                autoComplete="name"
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
                className="min-h-[48px] w-full rounded-lg border border-white/20 bg-black/50 px-4 py-3 text-base text-white placeholder:text-gray-500 focus:border-pink-500 focus:outline-none"
                placeholder="la.tua.email@example.com"
                autoComplete="email"
                inputMode="email"
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
                className="min-h-[48px] w-full rounded-lg border border-white/20 bg-black/50 px-4 py-3 text-base text-white placeholder:text-gray-500 focus:border-pink-500 focus:outline-none"
                placeholder="+39 XXX XXX XXXX"
                autoComplete="tel"
                inputMode="tel"
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
                className="min-h-[140px] w-full resize-none rounded-lg border border-white/20 bg-black/50 px-4 py-3 text-base text-white placeholder:text-gray-500 focus:border-pink-500 focus:outline-none"
                placeholder="Raccontami del tuo evento..."
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-3 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
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
