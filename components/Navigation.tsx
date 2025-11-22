'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Music, Home, User, Briefcase, Image as ImageIcon, Mail, Calendar, FileText } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'Chi Sono', href: '#about', icon: User },
  { name: 'Servizi', href: '#services', icon: Briefcase },
  { name: 'Date', href: '#dates', icon: Calendar },
  { name: 'Serate', href: '#gallery', icon: ImageIcon },
  { name: 'Blog', href: '/blog', icon: FileText },
  { name: 'Contatti', href: '#contact', icon: Mail },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-effect py-3' : 'py-5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <motion.a
            href="#home"
            className="flex items-center space-x-2 text-2xl font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Music className="text-pink-500" size={32} />
            <span className="text-gradient">Piluz DJ</span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="relative text-sm font-medium hover:text-pink-500 transition-colors"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {item.name}
                <motion.span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500"
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-effect mt-4"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 text-white hover:text-pink-500 transition-colors"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

