'use client'

import { motion } from 'framer-motion'
import { Music, Play, ArrowDown } from 'lucide-react'
import Image from 'next/image'

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => {
          const randomX = typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1000
          const randomY = typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 1000
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-pink-500/30 rounded-full"
              initial={{
                x: randomX,
                y: randomY,
              }}
              animate={{
                y: [null, typeof window !== 'undefined' ? Math.random() * window.innerHeight : randomY],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          )
        })}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8 lg:gap-12 min-h-screen">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 mb-4 md:mb-6 px-3 md:px-4 py-1.5 md:py-2 glass-effect rounded-full text-xs md:text-sm"
            >
              <Music className="text-pink-500" size={16} />
              <span className="font-medium">DJ Professionista</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-4 md:mb-6 leading-tight"
            >
              <span className="text-gradient">Francesco Pilato</span>
              <br />
              <span className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">Piluz per gli amici</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-300 mb-6 md:mb-8 max-w-2xl"
            >
              La musica che più mi piace, quella che per me ha un significato,
              <br className="hidden sm:block" />
              ma soprattutto quella che <span className="text-pink-500 font-semibold">MI, CI e VI</span> farà ballare.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4"
            >
              <motion.a
                href="#contact"
                className="group relative px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full font-semibold text-white overflow-hidden text-xs sm:text-sm md:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span>Contattami</span>
                  <Play size={14} className="sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>

              <motion.a
                href="#about"
                className="px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 glass-effect rounded-full font-semibold text-white border border-white/20 hover:border-pink-500/50 transition-colors text-xs sm:text-sm md:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Scopri di più
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Right Image/Logo */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: -10 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex-1 flex justify-center"
          >
            <motion.div
              className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Image
                src="/immagini/logo.jpg"
                alt="Francesco Pilato DJ Logo"
                fill
                className="object-contain drop-shadow-2xl"
                priority
                sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, (max-width: 1280px) 256px, 384px"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        >
          <motion.a
            href="#about"
            className="flex flex-col items-center space-y-1 md:space-y-2 text-gray-400 hover:text-pink-500 transition-colors cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs">Scorri</span>
            <ArrowDown size={16} className="md:w-5 md:h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

