'use client'

import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [honeypot, setHoneypot] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitOk, setSubmitOk] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitOk(false)
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          company: honeypot,
        }),
      })
      const data = (await res.json()) as { error?: string; success?: boolean }
      if (!res.ok) {
        setSubmitError(typeof data.error === 'string' ? data.error : 'Invio non riuscito.')
        return
      }
      setSubmitOk(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
      setHoneypot('')
    } catch {
      setSubmitError('Errore di rete. Riprova tra poco.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <section id="contact" className="section-y relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-pink-900/10 to-black" />

      <div className="container relative z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="text-gradient">Contatti</span>
          </h2>
          <div className="mx-auto mb-6 h-1 w-24 bg-gradient-to-r from-pink-500 to-purple-500" />
          <p className="mx-auto max-w-3xl px-1 text-base leading-relaxed text-gray-300 sm:text-lg md:text-xl">
            Hai un evento in programma? Contattami per rendere la tua serata indimenticabile.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Spazio riservato (prima colonna: informazioni / altro) */}
          <div className="hidden lg:block" aria-hidden />

          <motion.form
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onSubmit={handleSubmit}
            className="relative space-y-5 rounded-2xl glass-effect p-4 sm:space-y-6 sm:p-6 md:p-8"
          >
            <p className="sr-only" aria-live="polite">
              {submitOk ? 'Messaggio inviato correttamente.' : ''}
            </p>
            {/* Honeypot anti-bot: non compilare */}
            <div className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden>
              <label htmlFor="contact-company">Azienda</label>
              <input
                type="text"
                id="contact-company"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
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
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
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
              <label htmlFor="phone" className="mb-2 block text-sm font-medium">
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
              <label htmlFor="message" className="mb-2 block text-sm font-medium">
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

            {submitError ? (
              <p className="rounded-lg border border-red-500/40 bg-red-950/30 px-3 py-2 text-sm text-red-200">
                {submitError}
              </p>
            ) : null}
            {submitOk ? (
              <p className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-3 py-2 text-sm text-emerald-200">
                Messaggio inviato. Ti risponderò al più presto.
              </p>
            ) : null}

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
