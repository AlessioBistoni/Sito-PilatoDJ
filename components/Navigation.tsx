'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Music, Home, User, Briefcase, Image as ImageIcon, Mail, Calendar, FileText } from 'lucide-react'

const HEADER_INNER_H = '3.5rem' /* h-14 */

const navItems = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'Biografia', href: '#biografia', icon: User },
  { name: 'Servizi', href: '#services', icon: Briefcase },
  { name: 'Date', href: '#dates', icon: Calendar },
  { name: 'Serate', href: '#gallery', icon: ImageIcon },
  { name: 'Blog', href: '/blog', icon: FileText },
  { name: 'Contatti', href: '#contact', icon: Mail },
]

const panelTop = `calc(env(safe-area-inset-top, 0px) + ${HEADER_INNER_H})`

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="pt-safe">
        <div
          className={`relative z-[60] transition-all duration-300 ${
            scrolled ? 'glass-effect' : 'bg-black/40 backdrop-blur-sm'
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div
              className="flex items-center justify-between gap-3"
              style={{ minHeight: HEADER_INNER_H }}
            >
              <motion.a
                href="#home"
                className="flex min-w-0 items-center gap-2 text-lg font-bold sm:text-xl md:text-2xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Music className="shrink-0 text-pink-500" size={28} aria-hidden />
                <span className="text-gradient truncate">Piluz DJ</span>
              </motion.a>

              <div className="hidden items-center gap-6 md:flex lg:gap-8">
                {navItems.map((item) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="relative text-sm font-medium text-white/90 transition-colors hover:text-pink-500"
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    {item.name}
                    <motion.span
                      className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-pink-500 to-purple-500"
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                ))}
              </div>

              <button
                type="button"
                className="tap-target -mr-2 rounded-lg text-white md:hidden"
                onClick={() => setIsOpen((v) => !v)}
                aria-expanded={isOpen}
                aria-controls="mobile-nav"
                aria-label={isOpen ? 'Chiudi menu' : 'Apri menu'}
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed bottom-0 left-0 right-0 z-[55] bg-black/70 backdrop-blur-sm md:hidden"
              style={{ top: panelTop }}
              aria-label="Chiudi menu"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              id="mobile-nav"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 right-0 z-[56] max-h-[min(75dvh,calc(100dvh-5rem))] overflow-y-auto overscroll-contain border-b border-white/15 bg-black/95 shadow-xl md:hidden"
              style={{ top: panelTop }}
            >
              <nav className="container mx-auto flex flex-col gap-0.5 px-4 py-3 pb-safe sm:px-6">
                {navItems.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      className="flex min-h-[48px] items-center gap-4 rounded-xl px-3 py-3 text-base text-white active:bg-white/10"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.04 }}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon size={22} className="shrink-0 text-pink-400" aria-hidden />
                      <span>{item.name}</span>
                    </motion.a>
                  )
                })}
              </nav>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </motion.nav>
  )
}
